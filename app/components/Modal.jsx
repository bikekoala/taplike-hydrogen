import giftImg1 from '../../public/images/gift1.png';
import giftImg2 from '../../public/images/gift2.png';

export function DiscountModal({index, onClickBuyBtn, discountConfig}) {
  const clickBuyBtn = (config) => {
    onClickBuyBtn(config);
  };
  if (index == 0) {
    return (
      <div className="discount-box flex flex-col justify-center items-center">
        <div className="text-2xl font-medium mb-1">Only Today!</div>
        <div className="mb-6">
          Get <b>${discountConfig[index].label} cash bonus</b> your first order.
        </div>
        <div className="mb-4 w-16 h-16">
          <img src={giftImg1} alt="" className="w-16" />
        </div>
        <div className="text-5xl font-bold mb-2 underline-offset-8 text-red-500">
          ${discountConfig[index].label}
        </div>
        <div className="text-4xl font-bold mb-8 underline-offset-8">
          CASH BONUS
        </div>
        <div
          onClick={() => clickBuyBtn(discountConfig[index])}
          className="text-xl font-medium mb-5 w-full flex justify-center items-center h-10 rounded bg-rose-500 text-white cursor-pointer"
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
        <div className="text-5xl font-bold mb-2 text-red-500">${discountConfig[index].label}</div>
        <div className="text-5xl font-bold mb-8 ">CASH GIFT</div>
        <div
          onClick={() => clickBuyBtn(discountConfig[index])}
          className="text-xl font-medium mb-5 w-full flex justify-center items-center h-10 rounded bg-rose-500 text-white cursor-pointer"
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
        <div className="text-5xl font-bold mb-2 w-full flex items-center justify-center text-red-500">
          ${discountConfig[2].label}
        </div>
        <div className="text-4xl font-bold mb-8 w-full flex items-center justify-center">
          CASH BONUS
        </div>
        <div
          onClick={() => clickBuyBtn(discountConfig[2])}
          className="text-xl font-medium mb-5 w-full flex justify-center items-center h-10 rounded bg-rose-500 text-white cursor-pointer"
        >
          Claim Now!
        </div>
      </div>
    );
  }
}
