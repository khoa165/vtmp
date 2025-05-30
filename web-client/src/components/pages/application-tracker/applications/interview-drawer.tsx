import { Button } from '@/components/base/button';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/base/drawer';

interface InterviewDrawer<TData> {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  rowData: TData | null;
}

export function InterviewDrawer<TData>({
  open,
  onOpenChange,
  rowData,
}: InterviewDrawer<TData>) {
  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent side="bottom">
        <div className="mx-auto w-full max-w-sm h-[70vh]">
          <DrawerHeader>
            <DrawerTitle>Move Goal</DrawerTitle>
            <DrawerDescription>Set your daily activity goal.</DrawerDescription>
          </DrawerHeader>
          <div className="p-4 pb-0">
            <div className="flex items-center justify-center space-x-2">
              <div className="flex-1 text-center">
                <div className="text-7xl font-bold tracking-tighter">{}</div>
                <div className="text-muted-foreground text-[0.70rem] uppercase">
                  {rowData ? JSON.stringify(rowData) : ''}
                </div>
              </div>
            </div>
            <div className="mt-3 h-[120px]"></div>
          </div>
          <DrawerFooter>
            <Button>Submit</Button>
            <DrawerClose asChild>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
