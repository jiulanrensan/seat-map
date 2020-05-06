import Vue from 'vue';

import { Button } from 'pagoda-mobile';
import { NavBar } from 'pagoda-mobile';
import { Icon } from 'pagoda-mobile';
import { List } from 'pagoda-mobile';
// import { DetailList, DetailListItem } from 'pagoda-mobile';
import { DatetimePicker } from 'pagoda-mobile';
import { Field } from 'pagoda-mobile';
import { Popup } from 'pagoda-mobile';
import { Cell, CellGroup } from 'pagoda-mobile';
import { Picker } from 'pagoda-mobile';
import { Panel } from 'pagoda-mobile';
import { PullRefresh } from 'pagoda-mobile';
import { Dialog } from 'pagoda-mobile';
import { Checkbox, CheckboxGroup } from 'pagoda-mobile';
import { CountDown } from 'pagoda-mobile';
import { Toast } from 'pagoda-mobile';
import { ResultPage } from 'pagoda-mobile';

Vue.use(ResultPage);
Vue.use(Toast);
Vue.use(CountDown);

Vue.use(Checkbox);
Vue.use(CheckboxGroup);

// 全局注册
Vue.use(Dialog);

Vue.use(PullRefresh);

Vue.use(Panel);

Vue.use(Picker);

Vue.use(Cell);
Vue.use(CellGroup);

Vue.use(Popup);

Vue.use(Field);

Vue.use(DatetimePicker);

// Vue.use(DetailList).use(DetailListItem);

Vue.use(List);

Vue.use(Icon);
Vue.use(NavBar);
Vue.use(Button);
Vue.use(Toast);