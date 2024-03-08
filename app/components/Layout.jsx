/**
 * @param {LayoutProps}
 */
export function Layout({children, layout}) {
  return (
    <>
      <div className="flex flex-col h-fit justify-center items-center w-screen">
        <div className="flex flex-col h-fit w-full md:w-96 md:items-center relative bg-white">
          <main role="main" id="mainContent" className="flex-grow">
            {children}
          </main>
        </div>
      </div>
    </>
  );
}
