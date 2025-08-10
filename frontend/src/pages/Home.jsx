import Header from '../components/home/Header';
import PackagingOptions from '../components/home/PackagingOptions';
import Perfumes from '../components/home/Perfumes';
import PickupProcess from '../components/home/PickupProcess';
import SignatureLines from '../components/home/SignatureLines';
import Testimonials from '../components/home/Testimonials';
import VIPClubTeaser from '../components/home/VIPClubTeaser';
import WashTypeSelector from '../components/home/WashTypeSelector';
import WelcomeDialog from '../components/common/WelcomeDialog';

const Home = () => {
  return (
    <div>
        <WelcomeDialog />
        <Header />
        <SignatureLines />
        <WashTypeSelector />
        <Perfumes />
        <PackagingOptions />
        <PickupProcess />
        <Testimonials />
        <VIPClubTeaser />
    </div>
  )
}

export default Home