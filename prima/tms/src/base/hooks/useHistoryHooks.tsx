import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { setMainMenuInfo } from '../../redux/actions/AppActions';
import { menuList } from '../constant/ArrayList';

export function useHistoryHooks() {
    const history = useHistory();
    const appDispatch = useDispatch();


    function loadPage(routePath: any, params?: any) {
        let info: any = {
            index: 0,
        }
        menuList.map((element: any, index: number) => {
            if (routePath.startsWith(element.name)) {
                info.index = index;
                info.element = element;
            }
            return true;
        });
        appDispatch(setMainMenuInfo(info));
        history.push({
            pathname: routePath,
            search: params
        });
    }

    return loadPage;
}
