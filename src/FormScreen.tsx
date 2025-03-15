import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  Dimensions,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Animated,
  Keyboard
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import LinearGradient from 'react-native-linear-gradient';

type Props = NativeStackScreenProps<RootStackParamList, 'FormScreen'>;
const { width, height } = Dimensions.get('window');

const FormScreen: React.FC<Props> = ({ navigation, route }) => {
  // Guardando os dados que o usuário digita; se vierem da tela anterior, já usamos
  const [name, setName] = useState(route.params?.name ?? '');
  const [value, setValue] = useState(route.params?.value ? String(route.params?.value) : '');
  const [percent, setPercent] = useState(route.params?.percent ? String(route.params?.percent) : '');
  
  // Mensagens de erro para cada campo
  const [valueError, setValueError] = useState('');
  const [percentError, setPercentError] = useState('');
  
  // Controle de animações e foco dos inputs
  const [isFocused, setIsFocused] = useState({ name: false, value: false, percent: false });
  const fadeAnim = useState(new Animated.Value(0))[0];
  const scaleAnim = useState(new Animated.Value(0.8))[0];
  const slideXAnim = useState(new Animated.Value(-width))[0];

  // Verifica se o teclado está aberto para ajustar o layout
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    // Inicia animações assim que a tela aparece
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      }),
      Animated.timing(slideXAnim, {
        toValue: 0,
        duration: 1200,
        useNativeDriver: true,
      })
    ]).start();

    // Ajuste do layout quando o teclado abre ou fecha
    const keyboardShowEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const keyboardHideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';
    const keyboardShowListener = Keyboard.addListener(keyboardShowEvent, () => setKeyboardVisible(true));
    const keyboardHideListener = Keyboard.addListener(keyboardHideEvent, () => setKeyboardVisible(false));

    // Removendo os listeners quando não são mais necessários
    return () => {
      keyboardShowListener.remove();
      keyboardHideListener.remove();
    };
  }, []);

  // Animação simples para quando o botão é pressionado
  const handlePressIn = (anim: Animated.Value) => {
    Animated.spring(anim, {
      toValue: 0.9,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = (anim: Animated.Value) => {
    Animated.spring(anim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  // Mostra um alerta rápido com a mensagem passada
  const showAlert = (message: string) => {
    setTimeout(() => {
      Alert.alert('Atenção', message);
    }, 100);
  };

  // Tratamento do valor digitado para o campo "Valor Original"
  const handleValueChange = (text: string) => {
    setValueError('');
    const numericValue = text.replace(/[^0-9]/g, '');
    if (numericValue !== text) {
      setValueError('Digite apenas números para o valor.');
    }
    // Se houver números, converte para valor em reais (dividindo por 100)
    setValue(numericValue.length > 0 ? (Number(numericValue) / 100).toString() : '');
  };

  // Tratamento para o campo "Percentual de Aumento"
  const handlePercentChange = (text: string) => {
    setPercentError('');
    const numericValue = text.replace(/[^0-9]/g, '');
    if (numericValue !== text) {
      setPercentError('Digite apenas números para a porcentagem.');
    }
    setPercent(numericValue);
  };

  // Função chamada quando o usuário clica no botão para calcular
  const handleCalculate = () => {
    if (!name.trim()) {
      Alert.alert('Atenção', 'Preencha o nome do produto!');
      return;
    }
    if (!value || isNaN(Number(value))) {
      Alert.alert('Atenção', 'O valor original deve ser um número!');
      return;
    }
    if (!percent || isNaN(Number(percent))) {
      Alert.alert('Atenção', 'A porcentagem deve ser um número!');
      return;
    }

    const numericValue = Number(value);
    const numericPercent = Number(percent);
    const aumento = (numericValue * numericPercent) / 100;
    const newValue = numericValue + aumento;

    // Pequena animação para o botão, só para dar um feedback visual
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 0.5,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();

    // Navega para a tela de resultado passando os dados calculados
    navigation.navigate('ResultScreen', {
      itemName: name,
      originalValue: numericValue,
      updatedValue: newValue,
      percentUsed: numericPercent,
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />
      
      {/* Fundo com gradiente */}
      <LinearGradient
        colors={['#5E35B1', '#8E24AA', '#4A148C']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradientBackground}
      />

      {/* Elementos decorativos no fundo */}
      <View style={[styles.decorativeCircle, { top: height * 0.05, left: -50 }]} />
      <View style={[styles.decorativeCircle, { top: height * 0.4, right: -80 }]} />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            {/* Cabeçalho com animação */}
            <Animated.View 
              style={[
                styles.header,
                { 
                  opacity: fadeAnim,
                  transform: [{ translateX: slideXAnim }],
                  height: keyboardVisible ? 180 : 240
                }
              ]}
            >
              <Text style={styles.headerTitle}>Calcule & Reajuste seus produtos</Text>
              <Text style={styles.headerSubtitle}>
                Mantenha os preços atualizados conforme as mudanças do mercado.
              </Text>
            </Animated.View>

            {/* Caixa do formulário com os campos */}
            <Animated.View 
              style={[
                styles.formContainer,
                { 
                  opacity: fadeAnim,
                  transform: [
                    { translateX: slideXAnim },
                    { scale: scaleAnim }
                  ]
                }
              ]}
            >
              <View style={styles.formHeader}>
                <Text style={styles.formTitle}>Adicionar Produto</Text>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.fieldLabel}>Nome do Produto</Text>
                <View style={[styles.inputContainer, isFocused.name && styles.inputFocused]}>
                  <TextInput
                    style={styles.input}
                    placeholder="Ex: Camisa Polo"
                    placeholderTextColor="#A8A8A8"
                    value={name}
                    onChangeText={setName}
                    onFocus={() => setIsFocused(prev => ({ ...prev, name: true }))}
                    onBlur={() => setIsFocused(prev => ({ ...prev, name: false }))}
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.fieldLabel}>Valor Original</Text>
                <View style={[styles.inputContainer, isFocused.value && styles.inputFocused, valueError ? styles.inputError : null]}>
                  <TextInput
                    style={styles.input}
                    placeholder="R$ 0,00"
                    placeholderTextColor="#A8A8A8"
                    keyboardType="numeric"
                    value={value ? `R$ ${Number(value).toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.')}` : ''}
                    onChangeText={handleValueChange}
                    onFocus={() => setIsFocused(prev => ({ ...prev, value: true }))}
                    onBlur={() => setIsFocused(prev => ({ ...prev, value: false }))}
                  />
                </View>
                {valueError ? <Text style={styles.errorText}>{valueError}</Text> : null}
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.fieldLabel}>Percentual de Aumento</Text>
                <View style={[styles.inputContainer, isFocused.percent && styles.inputFocused, percentError ? styles.inputError : null]}>
                  <TextInput
                    style={styles.input}
                    placeholder="Ex: 20%"
                    placeholderTextColor="#A8A8A8"
                    keyboardType="numeric"
                    value={percent}
                    onChangeText={handlePercentChange}
                    onFocus={() => setIsFocused(prev => ({ ...prev, percent: true }))}
                    onBlur={() => setIsFocused(prev => ({ ...prev, percent: false }))}
                  />
                  <Text style={styles.percentSymbol}>%</Text>
                </View>
                {percentError ? <Text style={styles.errorText}>{percentError}</Text> : null}
              </View>

              <TouchableOpacity
                style={styles.button}
                onPress={handleCalculate}
                activeOpacity={0.8}
                onPressIn={() => handlePressIn(scaleAnim)}
                onPressOut={() => handlePressOut(scaleAnim)}
              >
                <LinearGradient
                  colors={['#7B1FA2', '#6A0DAD', '#4A148C']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.gradientButton}
                >
                  <Text style={styles.buttonText}>Reajustar</Text>
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default FormScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#171717',
  },
  gradientBackground: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: height * 0.5,
  },
  decorativeCircle: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  content: {
    flex: 1,
    paddingTop: StatusBar.currentHeight || 40,
  },
  header: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingTop: 20,
  },
  headerTitle: {
    fontSize: 35,
    fontWeight: 'bold',
    color: '#FFF',
    textAlign: 'center',
    marginBottom: 12,
    letterSpacing: 0.5,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  headerSubtitle: {
    fontSize: 16,
    fontWeight: '400',
    fontStyle: 'italic',
    color: 'rgba(255, 255, 255, 0.85)',
    textAlign: 'center',
    maxWidth: width * 0.85,
    lineHeight: 22,
  },
  formContainer: {
    marginTop: 20,
    marginBottom: 30,
    marginHorizontal: 20,
    backgroundColor: '#FFF',
    borderRadius: 28,
    padding: 24,
    borderWidth: 3,
    borderColor: 'black',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
  formHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.06)',
  },
  formTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: 20,
  },
  fieldLabel: {
    fontSize: 15,
    fontStyle: 'italic',
    color: '#555',
    marginBottom: 8,
    fontWeight: '700',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(0, 0, 0, 0.08)',
    borderRadius: 16,
    backgroundColor: '#F9F9F9',
    overflow: 'hidden',
  },
  inputFocused: {
    borderColor: '#6A0DAD',
    backgroundColor: '#FFF',
    shadowColor: '#6A0DAD',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  input: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#333',
  },
  percentSymbol: {
    paddingRight: 16,
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  button: {
    marginTop: 10,
    borderRadius: 20,
    overflow: 'hidden',
  },
  gradientButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
  },
  buttonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
    marginRight: 8,
  },
  inputError: {
    borderColor: '#FF5252',
    borderWidth: 1.5,
  },
  errorText: {
    color: '#FF5252',
    fontSize: 12,
    marginTop: 5,
    marginLeft: 5,
    fontStyle: 'italic',
  },
});
