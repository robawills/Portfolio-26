import dynamic from 'next/dynamic';

const BustViewer = dynamic(() => import('@/components/BustViewer'), {
  ssr: false,
});

const HomePage = (): React.ReactElement => {
  return <BustViewer />;
};

export default HomePage;
