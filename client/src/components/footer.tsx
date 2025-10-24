import { Heart, UtensilsCrossed, Github, Twitter, Mail } from "lucide-react";
import { Link } from "wouter";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-muted/50 mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-primary/10">
                <UtensilsCrossed className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-bold text-lg">Recipe Hub</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Discover, save, and share amazing recipes from around the world.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/saved" className="text-muted-foreground hover:text-foreground transition-colors">
                  Saved Recipes
                </Link>
              </li>
              <li>
                <Link href="/create" className="text-muted-foreground hover:text-foreground transition-colors">
                  Create Recipe
                </Link>
              </li>
              <li>
                <Link href="/profile" className="text-muted-foreground hover:text-foreground transition-colors">
                  Profile
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-semibold mb-4">Popular Cuisines</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>African</li>
              <li>Asian</li>
              <li>Mediterranean</li>
              <li>European</li>
            </ul>
          </div>

          {/* Social/Contact */}
          <div>
            <h4 className="font-semibold mb-4">Connect</h4>
            <div className="flex gap-3">
              <a
                href="#"
                className="p-2 rounded-lg bg-background hover:bg-primary/10 transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="p-2 rounded-lg bg-background hover:bg-primary/10 transition-colors"
                aria-label="GitHub"
              >
                <Github className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="p-2 rounded-lg bg-background hover:bg-primary/10 transition-colors"
                aria-label="Email"
              >
                <Mail className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <p>
            © {currentYear} Recipe Hub. All rights reserved.
          </p>
          <p className="flex items-center gap-1">
            Made with <Heart className="h-4 w-4 text-red-500 fill-current" /> for food lovers
          </p>
        </div>
      </div>
    </footer>
  );
}
