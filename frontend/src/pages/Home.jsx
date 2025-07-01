import Header from '../components/home/Header';
import PackagingOptions from '../components/home/PackagingOptions';
import PickupProcess from '../components/home/PickupProcess';
import SignatureLines from '../components/home/SignatureLines';
import WashTypeSelector from '../components/home/WashTypeSelector';

const Home = () => {
  return (
    <div>
        <Header />
        <SignatureLines />
        <WashTypeSelector />
        <PackagingOptions />
        <PickupProcess />
    </div>
  )
}

export default Home