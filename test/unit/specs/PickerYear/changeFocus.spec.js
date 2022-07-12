import PickerYear from '@/components/PickerYear.vue';
import { mount } from '@vue/test-utils';
import { en } from '@/locale';

describe('PickerYear: changing focus', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = mount(PickerYear, {
      propsData: {
        translation: en,
        allowedToShowView: () => true,
        pageDate: new Date(Date.UTC(2018, 0, 1)),
        selectedDate: new Date(Date.UTC(2018, 2, 24)),
        focusedDate: new Date(Date.UTC(2018, 1, 15)).getTime(),
        useUtc: true,
      },
      attachTo: document.body,
    });
  });

  afterEach(() => {
    wrapper.destroy();
  });

  describe('focusNextYear', () => {
    it('changes the focused date to the next year', () => {
      wrapper.vm.focusNextYear();
      expect(wrapper.emitted('update:focusedDate')).toEqual([ [ new Date(Date.UTC(2019, 1, 15)).getTime() ] ]);
    });

    it('changes to the next decade if the current focused date is the last year of the decade', async () => {
      await wrapper.setProps({ focusedDate: new Date(Date.UTC(2019, 11, 28)).getTime() });
      wrapper.vm.focusNextYear();
      expect(wrapper.emitted('update:focusedDate')).toEqual([ [ new Date(Date.UTC(2020, 11, 28)).getTime() ] ]);
    });

    it('displays the next decade if the current focused date is the last year of the decade', async () => {
      await wrapper.setProps({
        pageDate: new Date(Date.UTC(2010, 1, 1)),
        pageTimestamp: new Date(Date.UTC(2010, 1, 1)).getTime(),
        focusedDate: new Date(Date.UTC(2019, 11, 28)).getTime(),
      });
      wrapper.vm.focusNextYear();
      expect(wrapper.emitted('changedDecade')).toEqual([ [ new Date(Date.UTC(2020, 1, 1)) ] ]);
    });

    it('focuses on the new focused year after it changes', async () => {
      // fake the .sync prop update
      await wrapper.setProps({
        focusedDate: new Date(Date.UTC(2019, 1, 15)).getTime(),
      });
      wrapper.vm.focusNextYear();
      await wrapper.vm.$nextTick();
      expect(document.activeElement.textContent.trim()).toEqual('2019');
      wrapper.vm.focusNextYear();
      await wrapper.setProps({
        focusedDate: new Date(Date.UTC(2020, 1, 15)).getTime(),
      });
      await wrapper.vm.$nextTick();
      expect(document.activeElement.textContent.trim()).toEqual('2020');
    });
  });

  describe('focusPreviousYear', () => {
    it('changes the focused date to the previous year', () => {
      wrapper.vm.focusPreviousYear();
      expect(wrapper.emitted('update:focusedDate')).toEqual([ [ new Date(Date.UTC(2017, 1, 15)).getTime() ] ]);
    });

    it('changes to the previous decade if the current focused date is the first year of the decade', async () => {
      await wrapper.setProps({ focusedDate: new Date(Date.UTC(2010, 0, 1)).getTime() });
      wrapper.vm.focusPreviousYear();
      expect(wrapper.emitted('update:focusedDate')).toEqual([ [ new Date(Date.UTC(2009, 0, 1)).getTime() ] ]);
    });

    it('displays the previous decade if the current focused date is the first year of the decade', async () => {
      await wrapper.setProps({
        pageDate: new Date(Date.UTC(2020, 0, 1)),
        pageTimestamp: new Date(Date.UTC(2020, 0, 1)).getTime(),
        focusedDate: new Date(Date.UTC(2020, 0, 1)).getTime(),
      });
      wrapper.vm.focusPreviousYear();
      expect(wrapper.emitted('changedDecade')).toEqual([ [ new Date(Date.UTC(2010, 0, 1)) ] ]);
    });
  });

  describe('focusNextRow', () => {
    it('changes the focused date to the next row', async () => {
      await wrapper.setProps({
        pageDate: new Date(Date.UTC(2015, 10, 1)),
        pageTimestamp: new Date(Date.UTC(2015, 10, 1)).getTime(),
        focusedDate: new Date(Date.UTC(2015, 10, 11)).getTime(),
      });
      wrapper.vm.focusNextRow();
      expect(wrapper.emitted('update:focusedDate')).toEqual([ [ new Date(Date.UTC(2018, 10, 11)).getTime() ] ]);
    });

    it('changes to the first year of the next decade if the current focused date is in the last year of the current decade', async () => {
      await wrapper.setProps({
        pageDate: new Date(Date.UTC(2019, 10, 1)),
        pageTimestamp: new Date(Date.UTC(2019, 10, 1)).getTime(),
        focusedDate: new Date(Date.UTC(2019, 10, 11)).getTime(),
      });
      wrapper.vm.focusNextRow();
      expect(wrapper.emitted('update:focusedDate')).toEqual([ [ new Date(Date.UTC(2020, 10, 11)).getTime() ] ]);
    });

    it('displays the next decade if the current focused date is the last year of the decade', async () => {
      await wrapper.setProps({
        pageDate: new Date(Date.UTC(2010, 10, 1)),
        pageTimestamp: new Date(Date.UTC(2010, 10, 1)).getTime(),
        focusedDate: new Date(Date.UTC(2019, 10, 11)).getTime(),
      });
      wrapper.vm.focusNextRow();
      expect(wrapper.emitted('changedDecade')).toEqual([ [ new Date(Date.UTC(2020, 10, 1)) ] ]);
    });

    it('changes to the first row of the next decade if the current focused date is in the last row with orphans of the current decade', async () => {
      await wrapper.setProps({
        pageDate: new Date(Date.UTC(2017, 10, 1)),
        pageTimestamp: new Date(Date.UTC(2017, 10, 1)).getTime(),
        focusedDate: new Date(Date.UTC(2017, 10, 11)).getTime(),
      });
      wrapper.vm.focusNextRow();
      expect(wrapper.emitted('update:focusedDate')).toEqual([ [ new Date(Date.UTC(2021, 10, 11)).getTime() ] ]);
    });

    it('displays the next decade if the current focused date is  in the the last row with orphans of the decade', async () => {
      await wrapper.setProps({
        pageDate: new Date(Date.UTC(2010, 10, 1)),
        pageTimestamp: new Date(Date.UTC(2010, 10, 1)).getTime(),
        focusedDate: new Date(Date.UTC(2018, 10, 11)).getTime(),
      });
      wrapper.vm.focusNextRow();
      expect(wrapper.emitted('changedDecade')).toEqual([ [ new Date(Date.UTC(2020, 10, 1)) ] ]);
    });
  });

  describe('focusPreviousRow', () => {
    it('changes the focused date to the previous row', async () => {
      await wrapper.setProps({
        pageTimestamp: new Date(Date.UTC(2018, 11, 1)).getTime(),
        focusedDate: new Date(Date.UTC(2018, 11, 15)).getTime(),
      });
      wrapper.vm.focusPreviousRow();
      expect(wrapper.emitted('update:focusedDate')).toEqual([ [ new Date(Date.UTC(2015, 11, 15)).getTime() ] ]);
    });

    it('changes to the last year of the previous decade if the current focused date is in the first year of the current decade', async () => {
      await wrapper.setProps({
        pageDate: new Date(Date.UTC(2020, 10, 1)),
        pageTimestamp: new Date(Date.UTC(2020, 10, 1)).getTime(),
        focusedDate: new Date(Date.UTC(2020, 10, 11)).getTime(),
      });
      wrapper.vm.focusPreviousRow();
      expect(wrapper.emitted('update:focusedDate')).toEqual([ [ new Date(Date.UTC(2019, 10, 11)).getTime() ] ]);
    });

    it('displays the previous decade if the current focused date is the first year of the decade', async () => {
      await wrapper.setProps({
        pageDate: new Date(Date.UTC(2020, 10, 1)),
        pageTimestamp: new Date(Date.UTC(2020, 10, 1)).getTime(),
        focusedDate: new Date(Date.UTC(2020, 10, 11)).getTime(),
      });
      wrapper.vm.focusPreviousRow();
      expect(wrapper.emitted('changedDecade')).toEqual([ [ new Date(Date.UTC(2010, 10, 1)) ] ]);
    });

    it('changes to the first row of the previous decade if the current focused date is in the first row matching orphans of the current decade', async () => {
      await wrapper.setProps({
        pageDate: new Date(Date.UTC(2020, 10, 1)),
        pageTimestamp: new Date(Date.UTC(2020, 10, 1)).getTime(),
        focusedDate: new Date(Date.UTC(2022, 10, 11)).getTime(),
      });
      wrapper.vm.focusPreviousRow();
      expect(wrapper.emitted('update:focusedDate')).toEqual([ [ new Date(Date.UTC(2018, 10, 11)).getTime() ] ]);
    });

    it('displays the previous decade if the current focused date is in the the first row matching orphans of the decade', async () => {
      await wrapper.setProps({
        pageDate: new Date(Date.UTC(2021, 10, 1)),
        pageTimestamp: new Date(Date.UTC(2021, 10, 1)).getTime(),
        focusedDate: new Date(Date.UTC(2021, 10, 11)).getTime(),
      });
      wrapper.vm.focusPreviousRow();
      expect(wrapper.emitted('changedDecade')).toEqual([ [ new Date(Date.UTC(2011, 10, 1)) ] ]);
    });
  });

  it('focuses on the focused day when showing the year view', async () => {
    expect(document.activeElement.textContent.trim()).not.toEqual('2018');
    await wrapper.setProps({
      isInitialized: true,
      showYearView: true,
    });
    await wrapper.vm.$nextTick();
    expect(document.activeElement.textContent.trim()).toEqual('2018');
  });

  it('does not focus on the focused day when showing the year view before initializing', async () => {
    expect(document.activeElement.textContent.trim()).not.toEqual('2018');
    await wrapper.setProps({
      isInitialized: false,
      showYearView: true,
    });
    await wrapper.vm.$nextTick();
    expect(document.activeElement.textContent.trim()).not.toEqual('2018');
  });
});
