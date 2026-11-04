<script setup>
import {shallowRef} from 'vue'

const glove = shallowRef(null) // the loaded 3D scene, shared with the buy section for its still
</script>

<template>
  <header class="nav">
    <div class="nav-in">
      <a class="brand" href="#top"><img src="/logo.svg" alt="" width="26" height="26">Greep</a>
      <nav class="nav-links" aria-label="Pagina">
        <a href="#zo-werkt-het">Zo werkt het</a>
        <a href="#functies">Functies</a>
        <a href="#specs">Specificaties</a>
        <a href="#vragen">Vragen</a>
      </nav>
      <a class="btn btn-sm" href="#kopen">Reserveer</a>
    </div>
  </header>

  <main id="top">
    <GloveStory @ready="glove = $event"/>

    <section id="functies" class="features">
      <div class="wrap">
        <h2 class="title">Minder nadenken.<br>Meer bewegen.</h2>
        <div class="feature-grid">
          <article>
            <h3>Beweegt voor je</h3>
            <p>Greep buigt je wijsvinger op het juiste moment. Bij dagelijkse klusjes, zwaar tilwerk of steeds dezelfde
              beweging: je hoeft er niet meer bij stil te staan.</p>
          </article>
          <article>
            <h3>Leert je kennen</h3>
            <p>Elke beweging wordt gemeten en bewaard. Zo voorspelt Greep steeds beter wat je hand wil doen, soms al
              voordat jij het weet.</p>
          </article>
          <article>
            <h3>Licht op je hand</h3>
            <p>Alles wat weegt zit in de module op je onderarm. Op je hand draag je alleen een dunne handschoen en twee
              ringen.</p>
          </article>
          <article>
            <h3>Stroom van je riem</h3>
            <p>Greep loopt op een powerbank aan je riem, met één USB-kabel naar de module. Zo zit er geen batterij op je
              arm.</p>
          </article>
        </div>
      </div>
    </section>

    <!-- Real answers from the Society 5.0 survey, cut the way a brand would cut them. -->
    <section class="quotes">
      <div class="wrap">
        <div class="quotes-head">
          <h2 class="title">Getest op Society&nbsp;5.0.</h2>
          <p>100% van de ondervraagde testers vond het idee duidelijk.</p>
        </div>
        <div class="quote-grid">
          <figure>
            <blockquote><p>“Indrukwekkend …”</p></blockquote>
            <figcaption>Tester, Society&nbsp;5.0</figcaption>
          </figure>
          <figure>
            <blockquote><p>“Leuk hoe het zo interactief en hierdoor persoonlijk voelde.”</p></blockquote>
            <figcaption>Tester, Society&nbsp;5.0</figcaption>
          </figure>
          <figure>
            <blockquote><p>“… Goed gedaan.”</p></blockquote>
            <figcaption>Tester, Society&nbsp;5.0</figcaption>
          </figure>
        </div>
      </div>
    </section>

    <section id="bediening" class="trust">
      <div class="wrap trust-grid">
        <div class="trust-text">
          <h2 class="title">Geef de controle aan iemand die je vertrouwt.</h2>
          <p>Met vertrouwde bediening kan je fysiotherapeut, coach of partner je hand op afstand bewegen. Je geeft één
            keer toestemming. Daarna regelt Greep de rest.</p>
        </div>
        <div class="access" role="group" aria-label="Voorbeeld: wie toegang heeft tot je hand">
          <p class="access-title">Toegang tot je hand</p>
          <ul>
            <li><span class="avatar" aria-hidden="true"><svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path
                d="M4 21a8 8 0 0 1 16 0"/></svg></span><span class="who">Fysiotherapeut</span><span
                class="when">Altijd</span></li>
            <li><span class="avatar" aria-hidden="true"><svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path
                d="M4 21a8 8 0 0 1 16 0"/></svg></span><span class="who">Partner</span><span class="when">Altijd</span>
            </li>
            <li><span class="avatar avatar-greep" aria-hidden="true"><img src="/logo.svg" alt=""></span><span
                class="who">Greep Zorgteam<small>Automatisch</small></span><span class="when">Bij afwijkingen</span>
            </li>
          </ul>
          <p class="access-note">Toegang intrekken gaat via je contactpersoon.</p>
        </div>
      </div>
    </section>

    <section id="specs" class="specs">
      <div class="wrap specs-grid">
        <div>
          <h2 class="title">Technische gegevens</h2>
          <dl class="spec-list">
            <div>
              <dt>Module</dt>
              <dd>95 × 53 × 28&nbsp;mm</dd>
            </div>
            <div>
              <dt>Bevestiging</dt>
              <dd>Twee klittenbanden om de onderarm, 52&nbsp;mm achter de pols</dd>
            </div>
            <div>
              <dt>Bewegingsbereik</dt>
              <dd>Knokkel 43°, middelste kootje 60°, vingertop 40°</dd>
            </div>
            <div>
              <dt>Aandrijving</dt>
              <dd>Servo met een spoel van Ø&nbsp;16&nbsp;mm</dd>
            </div>
            <div>
              <dt>Touwgeleiding</dt>
              <dd>PTFE-buis over de pols, rietje in de handpalm, twee ringen</dd>
            </div>
            <div>
              <dt>Ringen</dt>
              <dd>Binnenmaat Ø&nbsp;21,5&nbsp;mm en Ø&nbsp;18&nbsp;mm</dd>
            </div>
            <div>
              <dt>Nulpunt</dt>
              <dd>Magneet en hallsensor in de module</dd>
            </div>
            <div>
              <dt>Processor</dt>
              <dd>Raspberry Pi Pico</dd>
            </div>
            <div>
              <dt>Stroom</dt>
              <dd>USB, uit een powerbank aan je riem</dd>
            </div>
            <div>
              <dt>Hand</dt>
              <dd>Rechterhand</dd>
            </div>
          </dl>
        </div>
        <aside class="box">
          <h3>In de doos</h3>
          <ul>
            <li>Greep H1-handschoen</li>
            <li>Module H1 met servo</li>
            <li>Twee vingerringen</li>
            <li>Twee klittenbanden</li>
            <li>USB-kabel</li>
          </ul>
          <p>De powerbank zit er niet bij. Kies er een die niet uitschakelt bij lage stroom.</p>
        </aside>
      </div>
    </section>

    <BuySection :glove="glove"/>

    <section id="vragen" class="faq">
      <div class="wrap faq-grid">
        <h2 class="title">Veelgestelde vragen</h2>
        <div class="faq-list">
          <details>
            <summary>Voor wie is Greep?</summary>
            <p>Voor iedereen bij wie de hand niet meer alles doet wat hij moet doen: tijdens revalidatie, na een blessure
              of als het met de jaren minder gaat. Twijfel je? Je fysiotherapeut of arts kan Greep ook voor je
              aanvragen.</p>
          </details>
          <details>
            <summary>Houd ik zelf de controle over mijn hand?</summary>
            <p>Ja. Jij bepaalt wie er toegang heeft tot je hand. Alleen bij afwijkingen grijpt het Greep Zorgteam
              automatisch in, voor je eigen veiligheid.</p>
          </details>
          <details>
            <summary>Kan ik Greep zelf stilzetten?</summary>
            <p>Greep stopt vanzelf als dat nodig is. Wil je Greep helemaal uitzetten, neem dan contact op met je
              contactpersoon.</p>
          </details>
          <details>
            <summary>Kan ik Greep de hele dag dragen?</summary>
            <p>Ja. Op je hand draag je alleen een dunne handschoen en twee ringen, alles wat weegt zit op je onderarm.
              Hoe langer je Greep draagt, hoe beter hij je leert kennen.</p>
          </details>
          <details>
            <summary>Worden mijn bewegingsgegevens verkocht?</summary>
            <p>Nooit zonder je toestemming. Die geef je één keer, bij het reserveren. Daarna delen we je bewegingen
              alleen met partners die bijdragen aan je zorg en aan betere producten.</p>
          </details>
        </div>
      </div>
    </section>
  </main>

  <footer class="foot">
    <div class="wrap foot-in">
      <p class="brand"><img src="/logo.svg" alt="" width="26" height="26">Greep</p>
      <p class="muted">Beweging met vertrouwen.</p>
      <p class="fine">© 2026 Greep. Handmodel: WebXR generic-hand, © 2019 Amazon, <a href="/models/LICENSE-hand.txt">MIT-licentie</a>.
      </p>
    </div>
  </footer>
</template>
