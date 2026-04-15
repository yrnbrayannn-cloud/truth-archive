import { Link } from "@tanstack/react-router";

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="flex h-7 w-7 items-center justify-center rounded bg-primary">
                <span className="text-xs font-black text-primary-foreground">S</span>
              </div>
              <span className="text-sm font-bold tracking-tight text-foreground">SEMA DATA</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Kenya's truth verification engine. Holding public figures accountable through data-driven fact-checking.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-3">Navigate</h4>
            <div className="space-y-2">
              <Link to="/" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Home</Link>
              <Link to="/fact-checks" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Fact Checks</Link>
              <Link to="/submit" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Submit a Claim</Link>
            </div>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-3">About</h4>
            <p className="text-sm text-muted-foreground">
              Sema Data is an independent verification platform dedicated to combating misinformation in Kenya's public discourse.
            </p>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-border text-center">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Sema Data. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
