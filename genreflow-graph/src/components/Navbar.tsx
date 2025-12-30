import { Home, Search, LayoutGrid } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Navbar() {
  return (
    <nav className="bg-background flex items-center justify-between h-16 px-4">
      {/* Left Half */}
      <div className="flex items-center gap-4">
        {/* Spotify Logo */}
        <svg 
          viewBox="0 0 1134 340" 
          className="h-10 w-auto text-foreground fill-current"
        >
          <path d="M8 171c0 92 76 168 168 168s168-76 168-168S268 4 176 4 8 79 8 171zm230 78c-39-24-89-30-147-17-14 2-16-18-4-20 64-15 118-8 162 19 11 7 0 24-11 18zm17-45c-45-28-114-36-167-20-17 5-23-21-7-25 61-18 136-9 188 23 14 9 0 31-14 22zM80 133c-17 6-28-23-9-30 59-18 159-15 221 22 17 9 1 37-17 27-54-32-145-35-195-19zm379 91c-17 0-33-6-47-20-1 0-1 1-1 1l-16 19c-1 1-1 2 0 3 18 16 40 24 64 24 34 0 55-19 55-47 0-24-15-37-50-46-29-7-34-12-34-22s10-16 23-16 25 5 39 15c0 0 1 1 2 1s1-1 1-1l14-20c1-1 1-1 0-2-16-13-35-20-56-20-31 0-53 19-53 46 0 29 20 38 52 46 28 6 32 12 32 22 0 11-10 17-25 17zm95-77v-13c0-1-1-2-2-2h-26c-1 0-2 1-2 2v147c0 1 1 2 2 2h26c1 0 2-1 2-2v-46c10 11 21 16 36 16 27 0 54-21 54-61s-27-60-54-60c-15 0-26 5-36 17zm30 78c-18 0-31-15-31-35s13-34 31-34 30 14 30 34-12 35-30 35zm68-34c0 34 27 60 62 60s62-27 62-61-26-60-61-60-63 27-63 61zm30-1c0-20 13-34 32-34s33 15 33 35-13 34-32 34-33-15-33-35zm140-58v-29c0-1 0-2-1-2h-26c-1 0-2 1-2 2v29h-13c-1 0-2 1-2 2v22c0 1 1 2 2 2h13v58c0 23 11 35 34 35 9 0 18-2 25-6 1 0 1-1 1-2v-21c0-1 0-2-1-2h-2c-5 3-11 4-16 4-8 0-12-4-12-12v-54h30c1 0 2-1 2-2v-22c0-1-1-2-2-2h-30zm129-3c0-11 4-15 13-15 5 0 10 0 15 2h1s1-1 1-2V93c0-1 0-2-1-2-5-2-12-3-22-3-24 0-37 15-37 39v12h-13c-1 0-2 1-2 2v22c0 1 1 2 2 2h13v89c0 1 1 2 2 2h26c1 0 1-1 1-2v-89h25l37 89c-4 9-8 11-14 11-5 0-10-1-15-4h-1l-1 1-9 19c0 1 0 3 1 3 9 5 17 7 27 7 19 0 30-9 39-33l45-116v-2c0-1-1-1-2-1h-27c-1 0-1 1-1 2l-28 78-30-78c0-1-1-2-2-2h-44v-3zm-83 3c-1 0-2 1-2 2v113c0 1 1 2 2 2h26c1 0 1-1 1-2V134c0-1 0-2-1-2h-26zm-6-33c0 10 9 19 19 19s18-9 18-19-8-18-18-18-19 8-19 18z"/>
        </svg>

        {/* Home Icon */}
        <button className="icon-btn-circle">
          <Home className="w-5 h-5" />
        </button>

        {/* Search Bar */}
        <div className="search-bar w-96">
          <Search className="w-5 h-5 text-muted-foreground mr-3" />
          <input 
            type="text" 
            placeholder="What do you want to play?"
            className="flex-1 bg-transparent border-none text-foreground placeholder:text-muted-foreground focus:outline-none text-sm"
          />
          <div className="border-l border-muted-foreground/50 pl-3 ml-3">
            <LayoutGrid className="w-5 h-5 text-muted-foreground hover:text-foreground cursor-pointer transition-transform hover:scale-105" />
          </div>
        </div>
      </div>

      {/* Right Half */}
      <div className="flex items-center">
        {/* Navigation Links */}
        <div className="flex items-center border-r border-muted-foreground/50 pr-4 mr-4">
          <span className="nav-text px-3 py-1 font-semibold text-muted-foreground hover:text-foreground cursor-pointer transition-colors text-sm">
            Premium
          </span>
          <span className="nav-text px-3 py-1 font-semibold text-muted-foreground hover:text-foreground cursor-pointer transition-colors text-sm">
            Support
          </span>
          <span className="nav-text px-3 py-1 font-semibold text-muted-foreground hover:text-foreground cursor-pointer transition-colors text-sm">
            Download
          </span>
        </div>

        {/* Auth Buttons */}
        <div className="flex items-center gap-4">
          <span className="text-muted-foreground hover:text-foreground cursor-pointer transition-colors font-semibold text-sm">
            Sign up
          </span>
          <Button 
            className="bg-foreground text-background hover:bg-foreground/90 font-bold rounded-full px-8 py-3 h-12 text-base transition-transform hover:scale-105"
          >
            Log in
          </Button>
        </div>
      </div>
    </nav>
  );
}
