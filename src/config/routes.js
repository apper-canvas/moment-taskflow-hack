import Home from '@/components/pages/Home';

export const routes = {
  home: {
    id: 'home',
    label: 'TaskFlow',
    path: '/',
    icon: 'CheckSquare',
    component: Home
  }
};

export const routeArray = Object.values(routes);
export default routes;