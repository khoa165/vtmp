import { Button } from '@/components/base/button';
import { CardWithForm } from '@/components/playground/demo-cart';
import { DataTableDemo } from '@/components/playground/demo-table';
import { Container, Row } from 'reactstrap';

export const Playground = () => {
  return (
    <Container>
      <Row>
        <Button variant="destructive">destructive</Button>
        <Button variant="outline">outline</Button>
        <Button variant="secondary">secondary</Button>
        <Button variant="ghost">ghost</Button>
      </Row>

      <DataTableDemo />
      <CardWithForm />
    </Container>
  );
};
