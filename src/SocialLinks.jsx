const socialLinks = [
  { name: "Facebook", href: "https://www.facebook.com/share/1JJJQbwQcp", icon: "facebook" },
  { name: "Instagram", href: "https://www.instagram.com/kadels_klothing/", icon: "instagram" },
  { name: "TikTok", href: "https://www.tiktok.com/@kadels_klothing?_r=1&_t=ZS-9BVbKmsBRrz", icon: "tiktok" },
  { name: "YouTube", href: "https://www.youtube.com/@kadels_klothing", icon: "youtube" }
];

const founderSocialLinks = [
  { name: "Facebook", href: "https://www.facebook.com/ginamusic", icon: "facebook" },
  { name: "Instagram", href: "https://www.instagram.com/gina_music", icon: "instagram" },
  { name: "TikTok", href: "https://www.tiktok.com/georgina_kattah", icon: "tiktok" },
  { name: "YouTube", href: "https://www.youtube.com/@georginakattah8226", icon: "youtube" }
];

const paths = {
  facebook: "M13.5 21v-8.2h2.8l.4-3.2h-3.2v-2c0-.9.3-1.6 1.6-1.6h1.7V3.1c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3v2.3H7.3v3.2h2.8V21h3.4z",
  instagram: "M7.5 2h9A5.5 5.5 0 0 1 22 7.5v9a5.5 5.5 0 0 1-5.5 5.5h-9A5.5 5.5 0 0 1 2 16.5v-9A5.5 5.5 0 0 1 7.5 2zm0 2A3.5 3.5 0 0 0 4 7.5v9A3.5 3.5 0 0 0 7.5 20h9a3.5 3.5 0 0 0 3.5-3.5v-9A3.5 3.5 0 0 0 16.5 4h-9zM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6zm5.2-3.3a1.2 1.2 0 1 1 0 2.4 1.2 1.2 0 0 1 0-2.4z",
  tiktok: "M19.6 7.2a6.8 6.8 0 0 1-4.2-1.5v8.1a6.1 6.1 0 1 1-5.3-6V11a2.8 2.8 0 1 0 2.1 2.7V2.5h3.2c.2 2.2 1.8 4 4.2 4.3v.4z",
  youtube: "M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8zM9.6 15.6V8.4l6.3 3.6-6.3 3.6z"
};

export default function SocialLinks({ footer = false, profile = false, className = "" }) {
  const links = profile ? founderSocialLinks : socialLinks;
  return (
    <nav className={`social-links${footer ? " footer-social-links" : ""}${className ? ` ${className}` : ""}`} aria-label={profile ? "Follow the founder on social media" : "Kadels Klothing social media"}>
      {links.map(link => (
        <a key={link.name} href={link.href} target="_blank" rel="noopener noreferrer" aria-label={`${profile ? "Founder" : "Kadels Klothing"} on ${link.name}`}>
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d={paths[link.icon]} /></svg>
          {!footer && <span>{link.name}</span>}
        </a>
      ))}
    </nav>
  );
}
