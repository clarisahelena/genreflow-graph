import { motion, AnimatePresence } from 'framer-motion';
import { useMusicStore } from '@/store/musicStore';
import { AlertTriangle, X, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function WarningBanner() {
  const { warning, suggestions, clearWarning } = useMusicStore();

  return (
    <AnimatePresence>
      {warning && (
        <motion.div
          initial={{ opacity: 0, y: -20, height: 0 }}
          animate={{ opacity: 1, y: 0, height: 'auto' }}
          exit={{ opacity: 0, y: -20, height: 0 }}
          className="bg-destructive/10 border border-destructive/30 rounded-lg p-4 mx-4 mt-4"
        >
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-destructive">{warning}</p>
              
              {suggestions.length > 0 && (
                <div className="mt-3 space-y-1">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Lightbulb className="w-3 h-3" />
                    <span>Suggestions:</span>
                  </div>
                  <ul className="text-xs text-foreground/80 space-y-1 pl-4">
                    {suggestions.map((suggestion, i) => (
                      <li key={i} className="list-disc">{suggestion}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-muted-foreground hover:text-foreground"
              onClick={clearWarning}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
