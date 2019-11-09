import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { MainScreen } from './Main';
import { EntryDetailScreen } from './EntryDetail';
import { LabelsScreen } from './Labels';
import { LabelDetailScreen } from './LabelDetail';

const AppNavigator = createStackNavigator(
  {
    Home: MainScreen,
    Details: EntryDetailScreen,
    Labels: LabelsScreen,
    LabelDetails: LabelDetailScreen
  },
  {
    initialRouteName: 'Home',
  }
);
const AppContainer = createAppContainer(AppNavigator);
export default AppContainer;
