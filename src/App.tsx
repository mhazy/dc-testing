import React from 'react';

import './App.css';
import { User, UserContextProvider } from "./context/user";
import Main from './views/main';
import { useDVCClient } from "@devcycle/devcycle-react-sdk";

type UserSwitcherProps = {
  setUser: (user: User) => void;
}

const USER_ONE = {
  id: 'abc',
  name: 'User One',
  subscriptions: ['taxUS'],
  email: 'user.one@example.org'
};
const USER_TWO = {
  id: 'def',
  name: 'User Two',
  subscriptions: ['taxUS', 'tax'],
  email: 'user.two@example.org'
};

function UserSwitcher(props: UserSwitcherProps) {
  const { setUser } = props;
  const users = [USER_ONE, USER_TWO];

  return (
    <div>
      { users.map((user) => (
        <button key={user.id} onClick={() => setUser(user)}>{ user.name } ({ user.id})</button>
      ))}
    </div>
  )

}

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = React.useState<User | null>(null);
  const [lastIdentify, setLastIdentified] = React.useState(Date.now());
  const handleSetUser = (user: User) => setCurrentUser(user);
  const client = useDVCClient();
  const userContextValue = React.useMemo(() => {
    return {
      user: currentUser
    }
  }, [currentUser]);

  React.useEffect(() => {
    console.log('=== identifying...');
    if (currentUser && client) {
      const subscriptionsAsFlags = currentUser.subscriptions.reduce((map, subscription) => {
        return {
          ...map,
          [subscription]: true
        };
      }, {});
      client
        .identifyUser({
          isAnonymous: false,
          user_id: currentUser.id,
          email: currentUser.email,
          name: currentUser.name,
          customData: {
            ...subscriptionsAsFlags
          }
        })
        .then((features) => {
          console.log('=== IDENTIFIED!', { features });
          // fixme: doing this to trigger a re-render
          setLastIdentified(Date.now());
        })
    }

    return () => {
      client.resetUser().then(() => {
        console.log('reset user');
      })
    }
  }, [client, currentUser]);


  return (
    <div>
      <UserContextProvider value={userContextValue}>
        <UserSwitcher setUser={handleSetUser}/>
        <Main/>
      </UserContextProvider>
    </div>
  );
}

export default App;
