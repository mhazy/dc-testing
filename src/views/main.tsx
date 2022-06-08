import React, { useEffect } from 'react';

import { UserContext } from "../context/user";
import { AuthRequired } from "../components/auth-required";
import { useDVCClient, useVariable, useVariableValue } from "@devcycle/devcycle-react-sdk";

type UseWatchFeatureHookOptions = {
    key: string
}

function createEventHandler(event: string) {
    function handleEvent(...args: unknown[]) {
        console.group(`Event Triggered: ${event}`);
        console.log(args);
        console.groupEnd();
    }
    return { event, handler: handleEvent };
}


function useWatchFeature(options: UseWatchFeatureHookOptions) {
    const { key } = options;
    const dvcClient = useDVCClient()
    useEffect(() => {
        const handleInitialized = createEventHandler('initialized');
        const handleVariableUpdated = createEventHandler(`variableUpdated:${key}`);
        const handleFeatureUpdated = createEventHandler(`featureUpdated:${key}`);

        // fixme: is this supposed to work, am I dumb?
        dvcClient.subscribe(handleInitialized.event, handleInitialized.handler);
        dvcClient.subscribe(handleVariableUpdated.event, handleVariableUpdated.handler);
        dvcClient.subscribe(handleFeatureUpdated.event, handleFeatureUpdated.handler);
        return () => {
            dvcClient.unsubscribe(handleInitialized.event, handleInitialized.handler);
            dvcClient.unsubscribe(handleVariableUpdated.event, handleVariableUpdated.handler);
            dvcClient.unsubscribe(handleFeatureUpdated.event, handleFeatureUpdated.handler);
            console.groupEnd();
        }
    }, [key, dvcClient]);
}

const Main: React.FC = () => {
    const { user } = React.useContext(UserContext);
    const [bump, setBump] = React.useState(Date.now());
    const dvcClient = useDVCClient()

    console.log('MAIN GOT RE-RENDERED');
    const FANCY_NEW_FEATURE = 'fancy-new-feature';
    const USER_MANAGER_FEATURE = 'user-manager';

    const fancyNewFeature = useVariableValue(FANCY_NEW_FEATURE, false);
    const userManager = useVariableValue(USER_MANAGER_FEATURE, false);
    const otherCoolNewFeatureValue = useVariableValue('other-cool-new-feature', false);
    const otherCoolNewFeature = useVariable('other-cool-new-feature', false);

    useWatchFeature({ key: FANCY_NEW_FEATURE });

    const features = dvcClient.allFeatures();
    const variables = dvcClient.allVariables();

    console.log({
        features,
        variables
    });

    useEffect(() => {
        function handleOnUpdate(...args: unknown[]) {
            console.group('got useVariable onUpdate');
            console.log(args);
            console.groupEnd();
        }
        // fixme: is this supposed to work, am I dumb?
        otherCoolNewFeature.onUpdate(handleOnUpdate)
        // Do we need to unsub?
    }, [otherCoolNewFeature]);

    return (
        <div key={bump}>
            { !user && <p>Choose a user</p>}
            <AuthRequired>
                <p>Hey {user?.name}</p>
                <pre>{ JSON.stringify(user, null, 2)}</pre>
                <ul>
                    { user?.subscriptions.map((sub) => <li key={sub}>{sub}</li>)}
                </ul>
                <p>User Manager? { userManager ? 'YEP!' : 'NOPE!'}</p>
                <p>Fancy New Feature? { fancyNewFeature ? 'YEP!' : 'NOPE!'}</p>
                <p>Other cool new feature? { otherCoolNewFeatureValue ? 'YEP!' : 'NOPE!'}</p>
                <button onClick={() => setBump(Date.now())}>Trigger Render</button>
            </AuthRequired>
        </div>
    )

}

export default Main;
