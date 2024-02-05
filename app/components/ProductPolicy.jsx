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
  const shippingPolicyContent = `We have a 30-day return policy, which means you have 30 days after receiving your item to request a return.\n\nTo be eligible for a return, your item must be in the same condition that you received it, unworn or unused, with tags, and in its original packaging. You’ll also need the receipt or proof of purchase.\n\nTo start a return, you can contact us at serve@popbestselling.com. Please note that returns will need to be sent to the following address\n\nIf your return is accepted, we’ll send you a return shipping label, as well as instructions on how and where to send your package. Items sent back to us without first requesting a return will not be accepted.\n\nYou can always contact us for any return question at serve@popbestselling.com\n`;
  const privacyPolicyContent = `We take your privacy very seriously and take all necessary security measures to protect your personal information`;
  const returnPolicyContent = `We know what you expect from our products and shopping experience, so we offer an unconditional 30-day money-back guarantee. As long as you are not satisfied within 30 days after receiving the goods, you can return the goods to us and we will provide a full refund.`;
  const aboutUsContent = `Our philosophy is that fashion should not be out of reach, but something that everyone can enjoy and own. Therefore, we continue to search and discover high-quality, well-designed clothing and present it to every customer at reasonable prices.`;

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
