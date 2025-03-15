# Reajuste de Preço App 💸📱

## Descrição do Projeto
Esse projeto foi desenvolvido em React Native com TypeScript, e tem como objetivo facilitar o reajuste do preço de um produto. Nele, o usuário informa o nome do produto, o valor original e a porcentagem de aumento, e o app calcula automaticamente o novo valor. O fluxo é dividido em duas telas:

- **Tela de Formulário:** Onde o usuário insere os dados.
- **Tela de Resultado:** Onde os cálculos são exibidos.

## Funcionalidades ✨

### Formulário de Entrada 📝
- Entrada para o nome do produto.
- Campo para o valor original, com validação para aceitar apenas números.
- Campo para a porcentagem de aumento, também com validação numérica.
- Validações que garantem que nenhum campo fique vazio ou com caracteres inválidos.

### Cálculo e Exibição de Resultado 🔢
- Cálculo do valor do aumento e do novo valor do produto.
- Exibição do valor original, do percentual aplicado, do valor do aumento e do novo valor.
- Indicador visual que mostra o impacto do aumento.

### Navegação Entre Telas 🔄
- Ao concluir o preenchimento e o cálculo, o app redireciona automaticamente para a tela de resultados.
- Um botão “Ajustar Valores” permite voltar à tela de formulário com os dados já preenchidos, facilitando edições.

### Animações e Feedback Visual 🎞️
- Animações suaves nas transições e nos botões para melhorar a experiência do usuário.
- Uso de efeitos como fade, slide e rotação para deixar a interface mais dinâmica e intuitiva.

### Design Agradável 🎨
- Utilização de gradientes e elementos decorativos (como círculos) para criar um visual moderno e elegante.
- Layout responsivo que se adapta a diferentes tamanhos de tela.

## Tecnologias Utilizadas 💻
- React Native CLI
- React Navigation para gerenciamento de telas.
- TypeScript para tipagem estática e organização do código.
- react-native-linear-gradient para criar efeitos de gradiente.
- Animated API do React Native para as animações.

## Estrutura do Projeto 📂
- **App.tsx**  
  Configura a navegação entre as telas e define os tipos dos parâmetros de cada rota.
- **src/FormScreen.tsx**  
  Tela onde o usuário insere os dados do produto. Contém as validações e animações que deixam a experiência mais fluida.
- **src/ResultScreen.tsx**  
  Tela que exibe os resultados do cálculo, mostrando de forma clara todos os valores e o impacto do aumento.
- **Styles**  
  Uso do StyleSheet para organizar os estilos e garantir a responsividade e o visual agradável do app.

## Desafios e Aprendizados 📚

### Validação de Dados
Aprendi a importância de validar os inputs para evitar erros e garantir uma boa experiência para o usuário.

### Animações
Trabalhar com a API de animações do React Native foi bem interresante, e o resultado foi uma interface mais interativa e atrativa.

### Navegação
A utilização do React Navigation facilitou o gerenciamento das telas e a passagem de dados entre elas.

### Design e Responsividade
Investir em um layout moderno com gradientes e elementos decorativos fez toda a diferença na aparência do app.

## Conclusão ✅
Este projeto me permitiu colocar em prática diversos conceitos do desenvolvimento mobile com React Native, como a criação de telas, validação de dados, animações e a implementação de um design atrativo. Foi uma experiência enriquecedora que ampliou meus conhecimentos e me deixou mais confiante para desafios futuros.

## Como Executar o Projeto 🚀

### Clone o Repositório
```bash
git clone <link-do-repositorio>
cd nome-do-projeto
npm install

**Se estiver rodando no iOS:**
cd ios && pod install && cd ..

npx react-native start
npx react-native run-android

**Para iOS:**
npx react-native run-ios


```

### Desenvolvido por [Macauly Vivaldo da Silva]
