import {IconClose, Link} from '~/components';
import giftImg1 from '../../public/images/gift1.png';
import giftImg2 from '../../public/images/gift2.png';

/**
 * @param {{
 *   children: React.ReactNode;
 *   cancelLink: string;
 * }}
 */
export function Modal({children, cancelLink}) {
  return (
    <div
      className="relative z-50"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
      id="modal-bg"
    >
      <div className="fixed inset-0 transition-opacity bg-opacity-75 bg-primary/40"></div>
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex items-center justify-center min-h-full p-4 text-center sm:p-0">
          <div
            className="relative flex-1 px-4 pt-5 pb-4 overflow-hidden text-left transition-all transform rounded shadow-xl bg-contrast sm:my-12 sm:flex-none sm:w-full sm:max-w-sm sm:p-6"
            role="button"
            onClick={(e) => {
              e.stopPropagation();
            }}
            onKeyPress={(e) => {
              e.stopPropagation();
            }}
            tabIndex={0}
          >
            <div className="absolute top-0 right-0 hidden pt-4 pr-4 sm:block">
              <Link
                to={cancelLink}
                className="p-4 -m-4 transition text-primary hover:text-primary/50"
              >
                <IconClose aria-label="Close panel" />
              </Link>
            </div>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

export function DiscountModal({index, onClickBuyBtn}) {
  const clickBuyBtn = (e) => {
    onClickBuyBtn(index);
  };
  if (index == 0) {
    return (
      <div className="discount-box flex flex-col justify-center items-center">
        <div className="text-2xl font-medium mb-1">Only Today!</div>
        <div className="mb-6">
          {/* Get <b>5% off</b> your first order. */}
          Get <b>$2 cash bonus</b> your first order.
        </div>
        <div className="mb-4 w-16 h-16">
          <img src={giftImg1} alt="" className="w-16" />
        </div>
        <div className="text-5xl font-bold mb-2 underline-offset-8">
          $2
        </div>
        <div className="text-4xl font-bold mb-8 underline-offset-8">
          CASH BONUS
        </div>
        <div
          onClick={clickBuyBtn}
          className="text-xl font-medium mb-5 w-full flex justify-center items-center h-10 rounded bg-rose-500 text-white"
        >
          Okay, Shop Now!
        </div>
      </div>
    );
  } else if (index == 1) {
    return (
      <div className="discount-box flex flex-col justify-center items-center">
        <div className="text-2xl font-bold mb-1">Congratulations!</div>
        <div className="font-bold mb-6">You've just won a reward!</div>
        <div className="mb-6 w-16 h-16">
          <img src={giftImg2} alt="" className="w-16" />
        </div>
        <div className="text-5xl font-bold mb-2 text-rose-500">$3</div>
        <div className="text-5xl font-bold mb-8 text-rose-500">CASH GIFT</div>
        <div
          onClick={clickBuyBtn}
          className="text-xl font-medium mb-5 w-full flex justify-center items-center h-10 rounded bg-rose-500 text-white"
        >
          Claim Prize
        </div>
      </div>
    );
  } else {
    return (
      <div className="discount-box flex flex-col justify-center items-center">
        <div className="w-full h-12 text-3xl font-bold flex justify-center items-center">
          Wait!
        </div>
        <div className="w-full h-8 mb-5 text-xl font-bold flex justify-center items-center">
          You're about to lose
        </div>
        <div className="text-5xl font-bold mb-2 w-full flex items-center justify-center">
          $5
        </div>
        <div className="text-4xl font-bold mb-8 w-full flex items-center justify-center">
          CASH BONUS
        </div>
        <div
          onClick={clickBuyBtn}
          className="text-xl font-medium mb-5 w-full flex justify-center items-center h-10 rounded bg-rose-500 text-white"
        >
          Claim Now!
        </div>
      </div>
    );
  }
}
