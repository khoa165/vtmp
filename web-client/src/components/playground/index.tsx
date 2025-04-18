import { Button } from '@/components/base/button';
import { CardWithForm } from '@/components/playground/demo-cart';
import { DataTableDemo } from '@/components/playground/demo-table';
import { Container, Row } from 'reactstrap';

export const Playground = () => {
  return (
    <Container>
      <div className="w-72 h-72 bg-destructive">destructive background</div>
      <div className="w-72 h-72 bg-vtmp-green">green background</div>
      <div className="w-72 h-72 bg-vtmp-gradient-linear">
        gradient background
      </div>
      <div className="w-72 h-72 bg-gradient-to-r from-vtmp-green via-vtmp-yellow via-vtmp-pink to-vtmp-blue">
        tutorial background
      </div>
      <div className="w-108 h-108 rainbow-gradient1">rainbow gradient 1</div>
      <div className="w-108 h-108 vtmp-gradient-light">vtmp gradient light</div>
      <div className="w-108 h-108 vtmp-gradient-dark">vtmp gradient dark</div>
      <div className="w-360 h-120 rainbow-gradient2">rainbow gradient 2</div>
      <div className="w-120 h-360 rainbow-gradient2">rainbow gradient 2</div>

      <Row>
        <Button variant="gradient">Phuc Jun</Button>
        <Button variant="destructive">destructive</Button>
        <Button variant="outline">outline</Button>
        <Button variant="secondary">secondary</Button>
        <Button variant="ghost">ghost</Button>
        <Button variant="gradient2">Phuc Jun</Button>
        <Button variant="colorText">Color Text</Button>
      </Row>

      <DataTableDemo />
      <CardWithForm />
    </Container>
  );
};
