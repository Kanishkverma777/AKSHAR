import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="not-found">
      <h1>404</h1>
      <p>The page you're looking for doesn't exist in this ERP system.</p>
      <Link to="/" className="btn btn-primary">
        <Home size={16} /> Back to Dashboard
      </Link>
    </div>
  );
}
