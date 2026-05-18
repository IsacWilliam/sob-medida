import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

export default function HomeScreen({ navigation }: any) {

  return (
    <View style={styles.container}>

      <Text style={styles.title}>
        Sob Medida
      </Text>

      <Text style={styles.subtitle}>
        App para costureiras
      </Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() =>
          navigation.navigate('NovoCliente')
        }
      >
        <Text style={styles.buttonText}>
          Novo Cliente
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() =>
          navigation.navigate('Clientes')
        }
      >
        <Text style={styles.buttonText}>
          Ver Clientes
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5EFE6',
    padding: 20,
  },

  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#7A3E2B',
  },

  subtitle: {
    marginTop: 10,
    fontSize: 18,
    color: '#444',
    marginBottom: 40,
  },

  button: {
    backgroundColor: '#7A3E2B',
    paddingVertical: 16,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginBottom: 15
  },

  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});