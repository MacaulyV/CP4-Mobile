import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  StatusBar,
  Animated,
  ScrollView,
  SafeAreaView
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import LinearGradient from 'react-native-linear-gradient';

type Props = NativeStackScreenProps<RootStackParamList, 'ResultScreen'>;

const { width, height } = Dimensions.get('window');

const ResultScreen: React.FC<Props> = ({ navigation, route }) => {
  // Pegando os dados passados da tela anterior
  const { itemName, originalValue, updatedValue, percentUsed } = route.params;
  const aumento = updatedValue - originalValue;

  // Configurando as animações que vou usar na tela
  const fadeAnim = useState(new Animated.Value(0))[0];
  const scaleAnim = useState(new Animated.Value(0.95))[0];
  const slideAnim = useState(new Animated.Value(30))[0];
  const rotateAnim = useState(new Animated.Value(0))[0];

  // Função para formatar os números em valor monetário
  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  };

  useEffect(() => {
    // Aqui eu configuro as animações de entrada da tela
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
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 1200,
        useNativeDriver: true,
      }),
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      })
    ]).start();
  }, []);

  // Configurando a rotação da animação de 3D
  const rotateY = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['90deg', '0deg']
  });

  // Feedback visual quando o usuário pressiona os botões
  const handlePressIn = (anim: Animated.Value) => {
    Animated.spring(anim, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = (anim: Animated.Value) => {
    Animated.spring(anim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  // Volta para a tela de formulário com os dados para edição
  const handleAlterar = () => {
    navigation.navigate('FormScreen', {
      name: itemName,
      value: originalValue,
      percent: percentUsed
    });
  };

  // Faz uma animação de saída antes de ir para uma nova simulação
  const handleNewCalculation = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      navigation.navigate('FormScreen');
    });
  };

  // Calcula a porcentagem do aumento para exibir no indicador visual
  const increaseFactor = ((updatedValue / originalValue) - 1) * 100;
  const indicatorWidth = Math.min(increaseFactor * 3, 100) + '%';

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />
      
      {/* Fundo com gradiente */}
      <LinearGradient
        colors={['#5E35B1', '#7B1FA2', '#4A148C']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradientBackground}
      />

      {/* Círculos decorativos no fundo */}
      <View style={[styles.decorativeCircle, { top: height * 0.1, left: -60 }]} />
      <View style={[styles.decorativeCircle, { top: height * 0.5, right: -70 }]} />

      <SafeAreaView style={{ flex: 1, marginTop: StatusBar.currentHeight || 40 }}>
        <ScrollView 
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Cabeçalho da tela */}
          <Animated.View 
            style={[
              styles.header,
              { 
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }]
              }
            ]}
          >
            <Text style={styles.headerTitle}>Reajuste Concluído</Text>
            <Text style={styles.headerSubtitle}>
              Aqui estão os detalhes do reajuste para o produto <Text style={{ fontWeight: 'bold' }}>{itemName}</Text>
            </Text>
          </Animated.View>

          {/* Card com os resultados */}
          <Animated.View 
            style={[
              styles.resultCard,
              { 
                opacity: fadeAnim,
                transform: [
                  { translateY: slideAnim },
                  { scale: scaleAnim },
                  { rotateY: rotateY }
                ]
              }
            ]}
          >
            <View style={styles.cardHeader}>
              <Text style={[styles.cardTitle, { textAlign: 'center', width: '100%' }]}>Resultado</Text>
            </View>

            <View style={styles.productSection}>
              <Text style={[styles.productName, { textAlign: 'center', width: '100%', color: '#6A0DAD' }]}>{itemName}</Text>
              <View style={styles.divider} />
            </View>

            <View style={styles.resultRow}>
              <Text style={styles.resultLabel}>Valor Original:</Text>
              <Text style={styles.resultValue}>{formatCurrency(originalValue)}</Text>
            </View>

            <View style={styles.resultRow}>
              <Text style={styles.resultLabel}>Percentual Aplicado:</Text>
              <Text style={styles.resultValue}>{percentUsed}%</Text>
            </View>

            <View style={styles.resultRow}>
              <Text style={styles.resultLabel}>Valor do Aumento:</Text>
              <Text style={[styles.resultValue, styles.increaseValue]}>
                {formatCurrency(aumento)}
              </Text>
            </View>

            <View style={styles.divider} />

            {/* Indicador visual mostrando o impacto do aumento */}
            <View style={styles.increaseIndicatorContainer}>
              <Text style={styles.increaseIndicatorLabel}>
                Impacto do Aumento
              </Text>
              <View style={styles.increaseBar}>
                <LinearGradient
                  colors={['#8E24AA', '#6A0DAD', '#4A148C']} 
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={[styles.increaseIndicator, { width: indicatorWidth as any }]}
                />
              </View>
              <Text style={styles.increasePercentText}>
                +{increaseFactor.toFixed(1)}%
              </Text>
            </View>

            <View style={styles.finalValueContainer}>
              <Text style={styles.finalValueLabel}>Novo Valor:</Text>
              <Text style={styles.finalValue}>{formatCurrency(updatedValue)}</Text>
            </View>
          </Animated.View>

          {/* Botões para ações: ajustar ou refazer o cálculo */}
          <Animated.View 
            style={[
              styles.actionsContainer,
              { 
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }]
              }
            ]}
          >
            <TouchableOpacity
              style={[styles.button, styles.secondaryButton]}
              onPress={handleAlterar}
              activeOpacity={0.8}
              onPressIn={() => handlePressIn(scaleAnim)}
              onPressOut={() => handlePressOut(scaleAnim)}
            >
              <Text style={styles.secondaryButtonText}>Ajustar Valores</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.button}
              onPress={handleNewCalculation}
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
                <Text style={styles.buttonText}>Nova Simulação</Text>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

export default ResultScreen;

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
    height: height * 0.45,
  },
  decorativeCircle: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  header: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 30,
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
  resultCard: {
    backgroundColor: '#FFF',
    borderRadius: 28,
    padding: 24,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  productSection: {
    marginBottom: 20,
  },
  productName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.06)',
    marginVertical: 5,
  },
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  resultLabel: {
    fontStyle: 'italic',
    fontSize: 16,
    color: '#555',
    fontWeight: '600',
  },
  resultValue: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
  },
  increaseValue: {
    color: '#9C27B0',
  },
  increaseIndicatorContainer: {
    marginVertical: 20,
  },
  increaseIndicatorLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  increaseBar: {
    height: 12,
    backgroundColor: '#EEE',
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 5,
  },
  increaseIndicator: {
    height: '100%',
    borderRadius: 6,
  },
  increasePercentText: {
    fontSize: 15,
    color: '#9C27B0',
    fontWeight: 'bold',
    alignSelf: 'flex-end',
  },
  finalValueContainer: {
    backgroundColor: '#F4EBFF',
    padding: 16,
    borderRadius: 25,
    marginTop: 10,
  },
  finalValueLabel: {
    fontSize: 18,
    color: '#000',
    fontWeight: '700',
    marginBottom: 4,
    textAlign: 'center',
  },
  finalValue: {
    fontSize: 32,
    color: '#6A0DAD',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  actionsContainer: {
    marginTop: 20,
    gap: 12,
  },
  button: {
    marginTop: 5,
    borderRadius: 20,
    borderColor: 'white',
    borderWidth: 1,
    overflow: 'hidden',
  },
  secondaryButton: {
    backgroundColor: 'black',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
  },
  secondaryButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
    marginLeft: 8,
  },
  gradientButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
    marginLeft: 8,
  },
});
