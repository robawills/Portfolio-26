import dynamic from 'next/dynamic';

const Hand3D = dynamic(() => import('@/components/Hand3D'), {
  ssr: false,
});

const HomePage = (): React.ReactElement => {
  return <Hand3D />;
};

export default HomePage;
