export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="relative bg-surface/30 border-t border-white/[0.05] transition-colors duration-400">
      <div className="max-w-[1100px] mx-auto px-6 md:px-10 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <span className="font-mono text-sm tracking-wide text-accent">
            ⛰ Peaks &amp; Paths
          </span>

          {/* Links */}
          <nav className="flex items-center gap-6">
            {['About', 'Map', 'Expeditions'].map((link) => (
              <a
                key={link}
                href={`#${link.toLowerCase()}`}
                className="text-xs font-sans text-text-muted transition-colors duration-200 hover:text-text"
              >
                {link}
              </a>
            ))}
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-sans text-text-muted transition-colors duration-200 hover:text-accent"
            >
              YouTube
            </a>
          </nav>

          {/* Copyright */}
          <p className="text-xs font-sans text-text-muted/60">
            © {year} Peaks &amp; Paths. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
