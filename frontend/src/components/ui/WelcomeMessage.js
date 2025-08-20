export default function WelcomeMessage({ user }) {
  const getUserDisplayName = () => {
    if (user?.user_metadata?.name) {
      return user.user_metadata.name;
    }
    if (user?.email) {
      return user.email.split('@')[0];
    }
    return 'User';
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="text-center sm:text-left">
      <h1 className="text-3xl font-bold text-gray-900">
        {getGreeting()}, {getUserDisplayName()}!
      </h1>
      <p className="text-gray-600 mt-2">
        Welcome to your LetterBuddy dashboard. Here&apos;s an overview of your letters.
      </p>
    </div>
  );
}
