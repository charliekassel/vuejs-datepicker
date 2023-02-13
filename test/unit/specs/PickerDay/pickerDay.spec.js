import PickerDay from '@/components/PickerDay.vue';
import { mount, shallowMount } from '@vue/test-utils';
import { en } from '@/locale';
import DaysGrid from '@/components/DaysGrid';
import PickerFooter from '@/components/PickerFooter';

describe('PickerDay: DOM', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallowMount(PickerDay, {
      propsData: {
        allowedToShowView: () => true,
        translation: en,
        pageDate: new Date(2018, 1, 1),
        selectedDate: new Date(2018, 2, 24),
      },
    });
  });

  it('knows the selected date', async () => {
    const newDate = new Date(2016, 9, 15);
    await wrapper.setProps({
      selectedDate: newDate,
    });
    expect(wrapper.vm.isSelectedDate(newDate)).toEqual(true);
    expect(wrapper.vm.isSelectedDate(new Date(2017, 1, 1))).toEqual(false);
  });

  it('emits an event when selected', () => {
    wrapper.vm.selectDate({ isDisabled: false });
    expect(wrapper.emitted().selectDate).toBeTruthy();
  });

  it('calls the function in highlightDate when hovering on a day cell', async () => {
    await wrapper.setProps({
      highlightDate: jest.fn(),
    });
    const daysGrids = wrapper.findAllComponents(DaysGrid);
    const daysGrid = daysGrids.wrappers[0];
    expect(daysGrid.exists()).toBe(true);
    const dateObj = wrapper.vm.getDateObject(new Date(2016, 12, 5));
    daysGrid.vm.$emit('mouseover', dateObj);
    expect(wrapper.props().highlightDate).toHaveBeenCalledTimes(1);
  });

  it('does not call the function in highlightDate when hovering on a disabled day cell', async () => {
    const date = new Date(2021, 8, 30);
    await wrapper.setProps({
      highlightDate: jest.fn(),
      disabledDates: {
        dates: [ date ],
      },
    });
    const daysGrids = wrapper.findAllComponents(DaysGrid);
    const daysGrid = daysGrids.wrappers[0];
    expect(daysGrid.exists()).toBe(true);
    const dateObj = wrapper.vm.getDateObject(date);
    daysGrid.vm.$emit('mouseover', dateObj);
    expect(wrapper.props().highlightDate).toHaveBeenCalledTimes(0);
  });

  it('calls the function in highlightDate when hovering on a day cell in the next month of a side by side calendar', async () => {
    await wrapper.setProps({
      highlightDate: jest.fn(),
      sideBySide: true,
    });
    const daysGrids = wrapper.findAllComponents(DaysGrid);
    const daysGrid = daysGrids.wrappers[1];
    expect(daysGrid.exists()).toBe(true);
    const dateObj = wrapper.vm.getDateObject(new Date(2016, 12, 5));
    daysGrid.vm.$emit('mouseover', dateObj);
    expect(wrapper.props().highlightDate).toHaveBeenCalledTimes(1);
  });

  it('knows the current page month', () => {
    expect(wrapper.vm.getPageMonth()).toEqual(1);
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

  it('emits show year calendar event when clicked on the year', () => {
    const yearBtn = wrapper.find('.day__month_btn');
    yearBtn.trigger('click');
    expect(wrapper.emitted().showMonthCalendar).toBeTruthy();
  });

  it('displays the footer if the showFooter prop is true', async () => {
    await wrapper.setProps({ showFooter: true });
    const footer = wrapper.findComponent(PickerFooter);
    expect(footer.exists()).toBe(true);
  });

  it('does not display the footer if the showFooter prop is false', async () => {
    await wrapper.setProps({ showFooter: false });
    const footer = wrapper.findComponent(PickerFooter);
    expect(footer.exists()).toBe(false);
  });

  it('displays a custom footer from a slot and hides the default footer', () => {
    wrapper = shallowMount(PickerDay, {
      propsData: {
        allowedToShowView: () => true,
        translation: en,
        pageDate: new Date(2018, 1, 1),
        selectedDate: new Date(2018, 2, 24),
        showFooter: true,
      },
      slots: {
        footer: '<p class="footer">The footer</p>',
      },
    });
    const footer = wrapper.findComponent(PickerFooter);
    expect(footer.exists()).toBe(false);

    const customFooter = wrapper.find('.footer');
    expect(customFooter.exists()).toBe(true);
    expect(customFooter.text()).toEqual('The footer');
  });

  describe('Day grids', () => {
    const getFirstGrid = (wrapper) => wrapper.find('[data-test-id="first-grid"]');
    const getSecondGrid = (wrapper) => wrapper.find('[data-test-id="second-grid"]');

    it('should render only one grid if it is not side by side', () => {
      wrapper = mount(PickerDay, {
        propsData: {
          allowedToShowView: () => true,
          clearDate: jest.fn(),
          pageDate: new Date(2018, 1, 1),
          selectedDate: new Date(2018, 2, 24),
          setToday: jest.fn(),
          showFooter: true,
          sideBySide: false,
          translation: en,
        },
      });
      expect(getFirstGrid(wrapper).exists()).toBe(true);
      expect(getSecondGrid(wrapper).exists()).toBe(false);
    });

    it('should render the second grid if it is side by side', () => {
      wrapper = mount(PickerDay, {
        propsData: {
          allowedToShowView: () => true,
          clearDate: jest.fn(),
          translation: en,
          pageDate: new Date(2018, 1, 1),
          selectedDate: new Date(2018, 2, 24),
          setToday: jest.fn(),
          showFooter: true,
          sideBySide: true,
        },
      });
      expect(getFirstGrid(wrapper).exists()).toBe(true);
      expect(getSecondGrid(wrapper).exists()).toBe(true);
    });
  });
});
