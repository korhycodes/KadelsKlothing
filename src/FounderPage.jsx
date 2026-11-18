import SocialLinks from "./SocialLinks.jsx";

function FounderHeader() {
  return (
    <>
      <div className="announcement">Made with intention, made for you</div>
      <header className="site-header">
        <a className="brand" href="index.html" aria-label="Kadels Klothing home">
          <img className="brand-logo" src="assets/logo.png" alt="" />
          <span className="brand-name">KADELS <small>KLOTHING</small></span>
        </a>
        <nav className="founder-nav" aria-label="Founder navigation">
          <a className="founder-back" href="index.html">← Back to the collection</a>
        </nav>
      </header>
    </>
  );
}

export default function FounderPage() {
  return (
    <div className="founder-page">
      <FounderHeader />
      <main>
        <section className="profile-hero">
          <div className="profile-hero-copy">
            <p className="eyebrow"><span className="eyebrow-line" /> THE PERSON BEHIND THE PIECES</p>
            <h1>Meet Kadel.<br /><em>Designer. Dreamer. Singer.</em></h1>
            <p>Founder and CEO of Kadels Klothing, Kadel brings her love of expressive style, creativity, and self-belief into everything she makes—and every song she shares.</p>
            <div className="profile-roles"><span>FOUNDER & CEO</span><span>FASHION DESIGNER</span><span>SINGER</span></div>
            <a className="button button-dark" href="#her-story">Get to know her <span>↓</span></a>
          </div>
          <div className="profile-portrait">
            <img src="assets/profile.jpg" alt="Kadel, founder of Kadels Klothing" />
            <div className="portrait-caption">KADEL · FOUNDER & CREATIVE</div>
          </div>
        </section>

        <section className="profile-story section-wrap" id="her-story">
          <div className="profile-story-heading">
            <p className="eyebrow">A LITTLE MORE ABOUT ME</p>
            <h2>One creative life.<br /><em>Many ways to express it.</em></h2>
          </div>
          <div className="profile-story-copy">
            <p>I’ve always loved the feeling of turning an idea into something real. For me, fashion is more than what we put on—it’s a way to show up as ourselves, to feel seen, and to take up space with confidence.</p>
            <p>That feeling is at the heart of Kadels Klothing. As founder and CEO, I’m building a brand that celebrates individuality through considered pieces, expressive details, and custom clothing made with the person wearing it in mind.</p>
            <p>Creativity doesn’t stop at the studio. Singing is another part of who I am: a chance to tell a story, share an emotion, and connect in a different way. Whether I’m creating a look or a song, I want it to feel honest, joyful, and unmistakably mine.</p>
            <p>Thank you for being here and supporting the journey. I hope you find something that reminds you to be exclusive, be divine, and always be yourself.</p>
          </div>
        </section>

        <section className="stage-gallery" aria-label="Kadel performing and sharing her music">
          <figure className="stage-photo stage-photo-feature">
            <img src="assets/stage.jpg" alt="Kadel performing live on stage" loading="lazy" />
            <figcaption>Music is another way I tell my story.</figcaption>
          </figure>
          <figure className="stage-photo">
            <img src="assets/stage1.jpg" alt="Kadel sharing her voice with a live audience" loading="lazy" />
            <figcaption>Moments on stage</figcaption>
          </figure>
          <figure className="stage-photo">
            <img src="assets/stage2.jpg" alt="Kadel performing and connecting through music" loading="lazy" />
            <figcaption>Made to be heard</figcaption>
          </figure>
        </section>

        <section className="release-section">
          <div className="release-copy">
            <p className="eyebrow">HER LATEST RELEASE</p>
            <h2>A voice of her <em>own.</em></h2>
            <p>Step into her music and enjoy the latest release on YouTube.</p>
            <a className="button button-dark" href="https://youtu.be/DFB55AttYV4?si=M3TN2jzgJmTCWG8E" target="_blank" rel="noopener noreferrer">Watch on YouTube <span>↗</span></a>
          </div>
          <div className="release-video">
            <iframe
              src="https://www.youtube-nocookie.com/embed/DFB55AttYV4?rel=0"
              title="Kadels Klothing founder’s latest music release"
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </section>

        <section className="founder-follow">
          <p className="eyebrow">LET’S STAY CONNECTED</p>
          <h2>Follow along with me.</h2>
          <p>New pieces, behind-the-scenes moments, music, and whatever I’m dreaming up next.</p>
          <SocialLinks profile className="founder-social-links" />
        </section>
        <section className="profile-bottom-cta">
          <p>Find something that feels like you.</p>
          <a className="button button-dark" href="index.html#shop">Explore Kadels Klothing <span>↗</span></a>
        </section>
      </main>
      <footer className="site-footer">
        <a className="brand footer-brand" href="index.html">
          <img className="brand-logo" src="assets/logo.png" alt="" />
          <span className="brand-name">KADELS <small>KLOTHING</small></span>
        </a>
        <p>Be exclusive. Be divine. Be yourself.</p>
        <span>© {new Date().getFullYear()} Kadels Klothing</span>
      </footer>
    </div>
  );
}
