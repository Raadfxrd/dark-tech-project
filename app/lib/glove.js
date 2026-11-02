import * as THREE from 'three'
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js'
import {RoomEnvironment} from 'three/addons/environments/RoomEnvironment.js'
import {segment, value} from './timeline.js'

// Model units are mm. Axes: x to the fingertips, y to the back of the hand, z to the pinky side.
const ANG = [-0.75, -1.05, -0.7] // rad at full flex: knuckle (MCP), middle (PIP), top (DIP)
const BONES = ['index-finger-phalanx-proximal', 'index-finger-phalanx-intermediate', 'index-finger-phalanx-distal', 'index-finger-tip']
const LID_LIFT = new THREE.Vector3(0, -34, 46) // where the lid goes when the module opens
const REST = 0.12 // finger flex while nobody pulls

// Camera stops: where it looks from (pos) and at (tgt).
const VIEWS = {
	hero: {pos: [-280, -270, -470], tgt: [-5, -12, 0]},
	module: {pos: [-330, -250, -190], tgt: [-80, -40, 8]}, // from the elbow side, so the hand recedes behind the module
	palm: {pos: [-5, -560, -170], tgt: [35, -12, 0]},
	finger: {pos: [80, -160, -205], tgt: [108, -14, -14]},
	outro: {pos: [-170, -330, -560], tgt: [-30, -12, 0]},
	shot: {pos: [-380, -427, -609], tgt: [-60, -18, 0]},
}

// The story, keyed by scroll progress. Captions hold while the camera holds (see GloveStory.vue).
const CAMERA = [[0, 'hero'], [0.07, 'hero'], [0.205, 'module'], [0.355, 'module'], [0.465, 'palm'], [0.565, 'palm'], [0.675, 'finger'], [0.855, 'finger'], [0.965, 'outro']]
const LID = [[0.15, 0], [0.23, 1], [0.33, 1], [0.42, 0]]
const FLEX = [[0.68, REST], [0.82, 1], [0.86, 1], [0.97, 0.55]]
const SIDE = [[0.855, 1], [0.965, 0]] // 1 = model beside the captions, 0 = centred

export async function createGlove(canvas, {modelUrl, still}) {
	const renderer = new THREE.WebGLRenderer({canvas, antialias: true, alpha: true})
	renderer.setPixelRatio(Math.min(devicePixelRatio, 2))
	renderer.toneMapping = THREE.NeutralToneMapping

	const scene = new THREE.Scene()
	scene.environment = new THREE.PMREMGenerator(renderer).fromScene(new RoomEnvironment(), 0.04).texture
	const key = new THREE.DirectionalLight(0xffffff, 1.4)
	key.position.set(-200, -300, -400)
	scene.add(key)

	const camera = new THREE.PerspectiveCamera(30, 1, 1, 5000)
	const views = Object.fromEntries(Object.entries(VIEWS).map(([name, v]) => {
		const tgt = new THREE.Vector3(...v.tgt), off = new THREE.Vector3(...v.pos).sub(tgt)
		return [name, {tgt, dir: off.clone().normalize(), dist: off.length()}]
	}))

	let w = 1, h = 1
	const resizer = new ResizeObserver(() => {
		w = canvas.clientWidth || 1
		h = canvas.clientHeight || 1
		renderer.setSize(w, h, false)
	})
	resizer.observe(canvas)

	const {scene: root} = await new GLTFLoader().loadAsync(modelUrl)
	scene.add(root)
	const rig = setupRig(root)
	scene.add(rig.rope)

	let flexNow = -1, lidNow = -1, pulled = 0, born = null
	const tgt = new THREE.Vector3(), dir = new THREE.Vector3()

	function aim(a, b, e, distScale) {
		tgt.lerpVectors(a.tgt, b.tgt, e)
		dir.lerpVectors(a.dir, b.dir, e).normalize()
		camera.position.copy(tgt).addScaledVector(dir, (a.dist + (b.dist - a.dist) * e) * distScale)
		camera.lookAt(tgt)
	}

	function setFlex(f) {
		if (Math.abs(f - flexNow) < 1e-4) return
		flexNow = f
		pulled = pose(rig, f)
	}

	function setLid(v) {
		if (v === lidNow) return
		lidNow = v
		for (const {o, p0} of rig.lid) o.position.copy(p0).addScaledVector(LID_LIFT, v)
	}

	setFlex(REST)
	setLid(0)

	return {
		// Draws the story at progress p and returns the finger's state for the readout.
		render(p, now) {
			const aspect = w / h, wide = aspect > 1.1
			born ??= now
			// On arrival the finger curls once, as if to say hello.
			const k = (now - born) / 1800
			const hello = still || k > 1 ? 0 : Math.sin(Math.PI * k) ** 2 * 0.5 * Math.max(0, 1 - p / 0.07)
			setFlex(value(p, FLEX) + hello)
			setLid(value(p, LID))

			const [i, j, e] = segment(p, CAMERA, still)
			// Portrait screens need more distance to fit the arm; captions on wide screens take ~40% of the width.
			aim(views[CAMERA[i][1]], views[CAMERA[j][1]], e, Math.min(2.4, Math.max(1, 1.5 / aspect)) * (wide ? 1.4 : 1))
			camera.aspect = aspect
			const side = value(p, SIDE, still)
			camera.setViewOffset(w, h, wide ? -0.17 * w * side : 0, wide ? 0 : 0.17 * h, w, h)
			renderer.render(scene, camera)

			const deg = (a) => Math.round(Math.abs(a * flexNow) * 180 / Math.PI)
			return {mcp: deg(ANG[0]), pip: deg(ANG[1]), dip: deg(ANG[2]), rope: Math.round(pulled)}
		},

		// A square still for the buy section, rendered off the live canvas and handed back as a data URL.
		shot(size) {
			const keep = {pr: renderer.getPixelRatio(), flex: flexNow, lid: lidNow}
			renderer.setPixelRatio(1)
			renderer.setSize(size, size, false)
			camera.aspect = 1
			camera.clearViewOffset() // also updates the projection
			setFlex(0.5)
			setLid(0)
			aim(views.shot, views.shot, 0, 1)
			renderer.render(scene, camera)
			const url = canvas.toDataURL('image/png')
			renderer.setPixelRatio(keep.pr)
			renderer.setSize(w, h, false)
			setFlex(keep.flex)
			setLid(keep.lid)
			return url
		},

		dispose() {
			resizer.disconnect()
			renderer.dispose()
		},
	}
}

function setupRig(root) {
	root.updateMatrixWorld(true)
	root.traverse((o) => {
		if (o.isSkinnedMesh) o.frustumCulled = false
	}) // bent fingers leave the bind-pose bounds
	const B = BONES.map((n) => root.getObjectByName(n))
	const UP = new THREE.Vector3(0, 1, 0)
	// Each joint bends about the axis across its bone, perpendicular to the back of the hand.
	const axes = [0, 1, 2].map((i) => {
		const a = B[i].getWorldPosition(new THREE.Vector3())
		const along = B[i + 1].getWorldPosition(new THREE.Vector3()).sub(a).normalize()
		const up = UP.clone().addScaledVector(along, -UP.dot(along)).normalize()
		return new THREE.Vector3().crossVectors(along, up).applyQuaternion(B[i].getWorldQuaternion(new THREE.Quaternion()).invert()).normalize()
	})
	const old = root.getObjectByName('touw')
	old.visible = false // the exported string is straight; we rebuild it along the eyelets every pose
	const rig = {
		B,
		axes,
		q0: B.slice(0, 3).map((b) => b.quaternion.clone()),
		pts: [0, 1, 2, 3].map((k) => root.getObjectByName('touw_punt_' + k)),
		knik: [1, 2, 3].map((k) => root.getObjectByName('touw_knik_' + k)),
		rope: new THREE.Mesh(new THREE.BufferGeometry(), old.material),
		lid: ['module_deksel', 'module_led'].map((n) => root.getObjectByName(n)).filter(Boolean).map((o) => ({
			o,
			p0: o.position.clone()
		})),
		root,
	}
	rig.rest = length(ropePath(rig))
	return rig
}

// The taut string: exit of the straw, the two lower eyelets, the anchor in the fingertip.
// A joint's contact point only counts when the straight line would otherwise cut through the finger.
function ropePath(rig) {
	const at = (o) => o.getWorldPosition(new THREE.Vector3())
	const G = rig.pts.map(at)
	const path = [G[0]]
	for (let i = 0; i < 3; i++) {
		const k = rig.knik[i]
		if (k) {
			const c = at(k), joint = at(rig.B[i])
			if (segmentDistance(joint, path.at(-1), G[i + 1]) < c.distanceTo(joint)) path.push(c)
		}
		path.push(G[i + 1])
	}
	return path
}

function segmentDistance(p, a, b) {
	const ab = b.clone().sub(a)
	const t = Math.min(1, Math.max(0, p.clone().sub(a).dot(ab) / ab.lengthSq()))
	return p.distanceTo(a.clone().addScaledVector(ab, t))
}

function length(path) {
	let L = 0
	for (let i = 1; i < path.length; i++) L += path[i].distanceTo(path[i - 1])
	return L
}

// Bends the index finger and re-lays the string; returns how many mm of string the spool has taken up.
function pose(rig, flex) {
	const q = new THREE.Quaternion()
	for (let i = 0; i < 3; i++) rig.B[i].quaternion.copy(rig.q0[i]).multiply(q.setFromAxisAngle(rig.axes[i], ANG[i] * flex))
	rig.root.updateMatrixWorld(true)
	const path = ropePath(rig)
	rig.rope.geometry.dispose()
	rig.rope.geometry = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(path, false, 'catmullrom', 0), 72, 0.8, 8, false)
	return Math.max(0, rig.rest - length(path))
}
