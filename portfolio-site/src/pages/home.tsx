import PagePadding from "../components/pagePadding";
import PhotoMosaic from "../components/photoMosaic";
import "../css/App.css";

function Home() {
  return (
    <>
      <PagePadding>
        <PhotoMosaic />
      </PagePadding>
    </>
  );
}

export default Home;
