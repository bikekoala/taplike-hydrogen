import { useDispatch } from "react-redux";
import { Heading } from '~/components';
import { LeftC, Close } from '@icon-park/react';

export function MobileHeader({
  onOpen,
  isDiscountModalOpen,
  onDiscountModalChange,
}) {
  const dispatch = useDispatch();

  const clickBackBtn = (e) => {
    dispatch({type: 'CLICK_BACK_BTN'})
    e.stopPropagation();
    if (isDiscountModalOpen === true) {
      onDiscountModalChange();
      setTimeout(() => {
        onOpen();
      }, 300);
    } else {
      onOpen();
    }
  };

  return (
    <header
      role="banner"
      className={'bg-primary/80 dark:bg-contrast/60 text-contrast dark:text-primary shadow-darkHeader flex items-center h-14 fixed backdrop-blur-lg z-999 top-0 justify-between w-full md:w-96 leading-none gap-4 px-4'}
    >
      <Heading
        className="font-bold text-center leading-none w-full"
      >
        <div className='w-full flex items-center justify-between'>
          <div
            className="flex flex-row justify-center items-center texl-6xl"
            onClick={(e) => clickBackBtn(e)}
          >
            <LeftC theme="multi-color" size="28" fill={['#ffffff' ,'#ffffff' ,'#000000' ,'#ffffff']} />
            <span className="text-xl ml-1 text-center">Back</span>
          </div>
          <div 
          onClick={(e) => clickBackBtn(e)}
          >
            <Close theme="outline" size="24" fill="#ffffff"/>
          </div>
        </div>
      </Heading>
    </header>
  );
}