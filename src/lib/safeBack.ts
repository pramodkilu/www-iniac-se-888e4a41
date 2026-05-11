import { useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";

/**
 * Returns a safe "go back" handler.
 * - If there is real history within this SPA session, navigates back.
 * - Otherwise falls back to the provided route (default "/").
 */
export function useSafeBack(fallback: string = "/") {
  const navigate = useNavigate();
  const location = useLocation();

  return useCallback(() => {
    // history.state.idx is set by React Router; >0 means we have prior in-app entries
    const idx = (window.history.state && (window.history.state as { idx?: number }).idx) ?? 0;
    if (idx > 0) {
      navigate(-1);
    } else {
      navigate(fallback, { replace: true });
    }
    // location dep keeps the closure stable across route changes
    void location;
  }, [navigate, fallback, location]);
}
