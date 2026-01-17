import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Lock, LogIn, UserPlus } from 'lucide-react';

interface AuthRequiredModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  gradeLabel?: string;
}

const AuthRequiredModal = ({ open, onOpenChange, gradeLabel }: AuthRequiredModalProps) => {
  const navigate = useNavigate();

  const handleSignIn = () => {
    onOpenChange(false);
    navigate('/auth', { state: { from: '/' } });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 border-white/20 text-white max-w-md">
        <DialogHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-cyan-500/20 flex items-center justify-center">
            <Lock className="w-8 h-8 text-cyan-400" />
          </div>
          <DialogTitle className="text-2xl font-bold text-white">
            Sign In Required
          </DialogTitle>
          <DialogDescription className="text-gray-300 text-base">
            {gradeLabel 
              ? `To access ${gradeLabel} chapters and start your learning journey, please sign in or create an account.`
              : 'To access chapters and start your learning journey, please sign in or create an account.'
            }
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <div className="space-y-3 text-sm text-gray-400">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center">
                <span className="text-cyan-400">🎯</span>
              </div>
              <span>Track your progress across all chapters</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center">
                <span className="text-purple-400">🏆</span>
              </div>
              <span>Earn badges and compete in Robo League</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center">
                <span className="text-orange-400">💾</span>
              </div>
              <span>Save your projects and achievements</span>
            </div>
          </div>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-3">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="flex-1 border-white/20 text-gray-300 hover:bg-white/10"
          >
            Maybe Later
          </Button>
          <Button
            onClick={handleSignIn}
            className="flex-1 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600"
          >
            <LogIn className="w-4 h-4 mr-2" />
            Sign In / Sign Up
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AuthRequiredModal;
