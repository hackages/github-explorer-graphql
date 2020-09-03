import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  StatusBar,
  FlatList,
} from 'react-native';
import {Colors, ReloadInstructions} from 'react-native/Libraries/NewAppScreen';
import {token} from './Constant';

import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  gql,
  useQuery,
} from '@apollo/client';

function Header() {
  return (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>Github Explorer</Text>
      <Text style={styles.sectionDescription}></Text>
    </View>
  );
}

const GET_ME = gql`
  query {
    viewer {
      login
      name
    }
  }
`;

const GET_REPOS = gql`
  query($number_of_repos: Int!) {
    viewer {
      name
      repositories(first: $number_of_repos) {
        nodes {
          name
        }
      }
    }
  }
`;

const App = () => {
  const {data, loading, error} = useQuery(GET_ME);
  const {login, name} = data?.viewer || {};

  const {data: nodes} = useQuery(GET_REPOS, {
    variables: {
      number_of_repos: 10,
    },
  });

  const repos = nodes?.viewer.repositories.nodes.map((node) => node.name);
  console.log(repos);

  // if (error) {
  //   return (
  //     <View>
  //       <Text>'Errorrrrr.....'</Text>
  //     </View>
  //   );
  // }

  // if (loading) {
  //   return (
  //     <View>
  //       <Text>App is loading</Text>
  //     </View>
  //   );
  // }
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <View style={styles.scrollView}>
          <Header />

          <View style={styles.body}>
            <Text>Login: {login}</Text>
          </View>
          <View style={styles.body}>
            <Text>Display name: {name}</Text>
          </View>

          <FlatList
            data={repos}
            renderItem={({item: repo}) => {
              return (
                <View style={styles.body} style={styles.item}>
                  <Text style={styles.title}>{repo}</Text>
                </View>
              );
            }}></FlatList>
        </View>
      </SafeAreaView>
    </>
  );
};

const client = new ApolloClient({
  uri: 'https://api.github.com/graphql',
  headers: {
    authorization: `Bearer ${token}`,
  },
  cache: new InMemoryCache(),
});

export default function AppWired() {
  return (
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: Colors.white,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
  item: {
    backgroundColor: '#165d6b',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 18,
  },
});
