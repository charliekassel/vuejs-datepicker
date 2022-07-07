import PickerDay from '@/components/PickerDay.vue';
import { shallow } from '@vue/test-utils';
import { en } from '@/locale';

describe('PickerDay: setToday', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallow(PickerDay, {
      propsData: {
        allowedToShowView: () => true,
        translation: en,
        pageDate: new Date(2018, 1, 1),
        selectedDate: new Date(2018, 2, 24),
      },
    });
  });

  it('Should execute selectDate with today date', () => {
    jest.useFakeTimers();
    const spy = jest.spyOn(wrapper.vm, 'selectDate');
    wrapper.vm.setToday();
    const today = (new Date()).getDate();
    expect(spy.mock.calls[0][0].date).toEqual(today);
  });
});
