import {Accordion, AccordionItem} from '@nextui-org/react';
import {
  Airplane,
  PersonalPrivacy,
  Return,
  Info,
  Down,
  Up,
} from '@icon-park/react';

/**
 * 产品落地页底部政策相关内容
 */
export function ProductPolicy() {
  const shippingPolicyContent = `Delivery time: We will arrange delivery within 1-3 working days after receiving the order and confirming payment.\nShipping areas: We support shipping worldwide. International shipping times may be extended, please be patient.\nShipping Methods: We use reliable logistics partners for delivery, usually express or postal services.\nShipping Charges: Shipping charges will be based on the total price of your order, destination and selected shipping method. Specific shipping charges will be displayed on the checkout page. Track your order: Once your order ships, you will receive a confirmation email with tracking information so you can stay informed about the progress of your order.\nDelivery delays: Under extreme circumstances, such as weather effects, busy transportation, etc., delivery delays may occur. We'll do our best to resolve your issue and provide updates.`;
  const privacyPolicyContent = `Information disclosureWe will not sell, rent or trade your personal information to any third party. We will only share your information with third parties when necessary for order processing, logistics and delivery and other services. Information protectionWe take various security measures to protect your personal information from unauthorized access, disclosure, modification or destruction. We regularly review and update our security measures to ensure that your personal information is adequately protected.`;
  const returnPolicyContent = `Return time: We provide no-reason return service within 30 days. If you are not satisfied with the purchased goods or encounter quality problems, please contact us within 30 days after receiving the goods to apply for a return.\nReturn conditions: In order to ensure that your return goes smoothly, please ensure that the following conditions are met:Items must be in unused, unmodified, and undamaged condition. Items must be accompanied by complete original packaging and all accessories.\nReturn Process: Please follow the steps below to make a return:Please contact our customer service team and provide your order number and reason for return. Our customer service team will guide you through your return request and provide you with a return address. Please package the item securely and send it back to us using trackable postage.\nRefund Processing: Once we receive and inspect your returned merchandise, we will process your refund request within 5 working days of receipt. Refunds will be made back to the original payment method you used to pay.`;
  const aboutUsContent = `Welcome to arealx.com! We provide high-quality products for home, fashions, outdoor adventures, and more. Our commitment to excellence ensures you get reliable and innovative solutions. Contact us at service@d1mcn.com. Thank you for choosing our company.`;

  return (
    <>
      <Accordion selectionMode="multiple">
        <AccordionItem
          key="1"
          aria-label="Accordion 1"
          title="Shipping Policy"
          className="text-base"
          disableIndicatorAnimation="true"
          indicator={({isOpen}) =>
            isOpen ? (
              <Up theme="outline" size="20" fill="#4a4a4a" />
            ) : (
              <Down theme="outline" size="20" fill="#4a4a4a" />
            )
          }
          startContent={<Airplane theme="outline" size="20" fill="#4a4a4a" />}
        >
          <p className="whitespace-pre-wrap text-sm">{shippingPolicyContent}</p>
        </AccordionItem>
        <AccordionItem
          key="2"
          aria-label="Accordion 2"
          title="Privacy Policy"
          disableIndicatorAnimation="true"
          indicator={({isOpen}) =>
            isOpen ? (
              <Up theme="outline" size="20" fill="#4a4a4a" />
            ) : (
              <Down theme="outline" size="20" fill="#4a4a4a" />
            )
          }
          startContent={
            <PersonalPrivacy theme="outline" size="20" fill="#4a4a4a" />
          }
        >
          <p className="whitespace-pre-wrap text-sm">{privacyPolicyContent}</p>
        </AccordionItem>
        <AccordionItem
          key="3"
          aria-label="Accordion 3"
          title="Return Policy"
          disableIndicatorAnimation="true"
          indicator={({isOpen}) =>
            isOpen ? (
              <Up theme="outline" size="20" fill="#4a4a4a" />
            ) : (
              <Down theme="outline" size="20" fill="#4a4a4a" />
            )
          }
          startContent={<Return theme="outline" size="20" fill="#4a4a4a" />}
        >
          <p className="whitespace-pre-wrap text-sm">{returnPolicyContent}</p>
        </AccordionItem>
        <AccordionItem
          key="4"
          aria-label="Accordion 3"
          title="About Us"
          disableIndicatorAnimation="true"
          indicator={({isOpen}) =>
            isOpen ? (
              <Up theme="outline" size="20" fill="#4a4a4a" />
            ) : (
              <Down theme="outline" size="20" fill="#4a4a4a" />
            )
          }
          startContent={<Info theme="outline" size="20" fill="#4a4a4a" />}
        >
          <p className="whitespace-pre-wrap text-sm">{aboutUsContent}</p>
        </AccordionItem>
      </Accordion>
    </>
  );
}
