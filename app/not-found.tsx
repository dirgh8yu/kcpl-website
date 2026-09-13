import { Container, Button } from '@/components/ui';
export default function NotFound() { return <Container className="not-found"><p className="eyebrow">404 / Page not found</p><h1>This page isn’t<br />on the route.</h1><p>Return to the homepage or contact KCPL about your shipment.</p><Button href="/">Return home</Button></Container>; }
