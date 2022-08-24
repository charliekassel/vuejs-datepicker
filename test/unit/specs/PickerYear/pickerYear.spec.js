import PickerYear from '@/components/PickerYear.vue';
import { shallowMount } from '@vue/test-utils';
import { en } from '@/locale';

describe('PickerYear', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallowMount(PickerYear, {
      propsData: {
        allowedToShowView: () => true,
        translation: en,
        pageDate: new Date(2018, 1, 1),
        selectedDate: new Date(2018, 2, 24),
      },
    });
  });

  it('knows the selected year', async () => {
    const newDate = new Date(2016, 9, 15);
    await wrapper.setProps({
      selectedDate: newDate,
    });
    expect(wrapper.vm.isSelectedYear(newDate)).toEqual(true);
    expect(wrapper.vm.isSelectedYear(new Date(2017, 1, 1))).toEqual(false);
  });

  it('can set the next decade', () => {
    wrapper.vm.nextDecade();
    expect(wrapper.emitted().changedDecade).toBeTruthy();
  });

  it('can set the previous decade', () => {
    wrapper.vm.previousDecade();
    expect(wrapper.emitted().changedDecade).toBeTruthy();
  });

  it('Sets the aria-modal attribute to true for the wrapper if it is not inline', async () => {
    await wrapper.setProps({
      inline: false,
    });
    expect(wrapper.attributes('aria-modal')).toBe('true');
  });

  it('Sets the aria-modal attribute to false for the wrapper if it is inline', async () => {
    await wrapper.setProps({
      inline: true,
    });
    expect(wrapper.attributes('aria-modal')).toBe('false');
  });

  it('formats the decade range', async () => {
    await wrapper.setProps({
      pageDate: new Date(2021, 1, 1),
    });
    expect(wrapper.vm.getPageDecade).toEqual('2020 - 2029');
    await wrapper.setProps({
      pageDate: new Date(2001, 1, 1),
    });
    expect(wrapper.vm.getPageDecade).toEqual('2000 - 2009');
  });

  it('emits an event when selected', () => {
    wrapper.vm.selectYear({ isDisabled: false });
    expect(wrapper.emitted().selectYear).toBeTruthy();
  });
});
