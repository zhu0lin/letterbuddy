import AnalysisPage from './analysis';

export const metadata = {
  title: 'LetterBuddy - Analysis',
  description: 'View detailed analysis of your handwriting sample.',
};

export default function Page({ params }) {
  return <AnalysisPage id={params.id} />;
}
