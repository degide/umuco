
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { CreditCard, User, Calendar, LockKeyhole } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Course } from '@/components/courses/CourseCard';
import { ScrollArea } from '@/components/ui/scroll-area';

interface PaymentModalProps {
  course: Course | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (courseId: string) => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({
  course,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  
  if (!course) return null;
  
  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!cardNumber || !cardName || !expiryDate || !cvv) {
      toast({
        title: t('courses.validation.title', 'Error'),
        description: t('courses.validation.allFieldsRequired', 'Please fill in all payment fields'),
        variant: "destructive",
      });
      return;
    }
    
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      
      // Success
      toast({
        title: t('courses.paymentSuccess'),
        description: t('courses.enrollmentSuccess', { courseName: course.title }),
      });
      
      onSuccess(course.id);
      onClose();
      navigate(`/course/${course.id}/learn`);
    }, 1500);
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>{t('courses.paymentDetails')}</DialogTitle>
          <DialogDescription>
            {t('courses.enrollIn', 'Enroll in')} {course.title} {t('common.for', 'for')} ${course.price}
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="flex-1">
          <form onSubmit={handlePayment} className="space-y-6 pr-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="cardNumber">{t('courses.cardNumber')}</Label>
                <div className="relative mt-1">
                  <CreditCard className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                  <Input
                    id="cardNumber"
                    placeholder="1234 5678 9012 3456"
                    className="pl-10"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    required
                    minLength={16}
                    maxLength={19}
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="cardName">{t('courses.nameOnCard')}</Label>
                <div className="relative mt-1">
                  <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                  <Input
                    id="cardName"
                    placeholder="John Doe"
                    className="pl-10"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="expiryDate">{t('courses.expiryDate')}</Label>
                  <div className="relative mt-1">
                    <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                    <Input
                      id="expiryDate"
                      placeholder="MM/YY"
                      className="pl-10"
                      value={expiryDate}
                      onChange={(e) => setExpiryDate(e.target.value)}
                      required
                      maxLength={5}
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="cvv">{t('courses.cvv')}</Label>
                  <div className="relative mt-1">
                    <LockKeyhole className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                    <Input
                      id="cvv"
                      placeholder="123"
                      className="pl-10"
                      type="password"
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value)}
                      required
                      maxLength={4}
                    />
                  </div>
                </div>
              </div>
            </div>
          </form>
        </ScrollArea>
        
        <DialogFooter className="pt-4">
          <Button variant="outline" type="button" onClick={onClose} disabled={isProcessing}>
            {t('common.cancel')}
          </Button>
          <Button type="submit" onClick={handlePayment} disabled={isProcessing}>
            {isProcessing ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                {t('courses.processing')}
              </>
            ) : (
              t('courses.completePayment')
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentModal;
