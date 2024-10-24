<!--用法示例-->
<!--<money-input v-model="listQuery.name" :decimal="4" :symbol="symbol" clearable></money-input>-->
<template>
  <div
    :class="[
      type === 'textarea' ? 'el-textarea' : 'el-input',
      inputSize ? 'el-input--' + inputSize : '',
      {
        'is-disabled': disabled,
        'el-input-group': $slots.prepend || $slots.append,
        'el-input-group--append': $slots.append,
        'el-input-group--prepend': $slots.prepend,
        'el-input--prefix': $slots.prefix || prefixIcon,
        'el-input--suffix': $slots.suffix || suffixIcon
      }
    ]"
    @mouseenter="hovering = true"
    @mouseleave="hovering = false"
  >
    <template v-if="type !== 'textarea'">
      <!-- 前置元素 -->
      <div class="el-input-group__prepend" v-if="$slots.prepend" tabindex="0">
        <slot name="prepend"></slot>
      </div>
      <input
        v-if="type !== 'textarea'"
        class="el-input__inner"
        v-bind="$props"
        :autocomplete="autoComplete"
        :value="formatValue"
        ref="input"
        @focus="handleFocus"
        @blur="handleBlur"
        @change="handleChange"
        :aria-label="label"
        :oninput="oninput"
      />
      <!-- 前置内容 -->
      <span
        class="el-input__prefix"
        v-if="$slots.prefix || prefixIcon"
        :style="prefixOffset"
      >
        <slot name="prefix"></slot>
        <i class="el-input__icon" v-if="prefixIcon" :class="prefixIcon"> </i>
      </span>
      <!-- 后置内容 -->
      <span
        class="el-input__suffix"
        v-if="
          $slots.suffix ||
            suffixIcon ||
            showClear ||
            (validateState && needStatusIcon)
        "
        :style="suffixOffset"
      >
        <span class="el-input__suffix-inner">
          <template v-if="!showClear">
            <slot name="suffix"></slot>
            <i class="el-input__icon" v-if="suffixIcon" :class="suffixIcon">
            </i>
          </template>
          <i
            v-else
            class="el-input__icon
            el-input__clear
            el-icon-circle-close"
            @click="clear"
          ></i>
        </span>
        <i
          class="el-input__icon"
          v-if="validateState"
          :class="['el-input__validateIcon', validateIcon]"
        >
        </i>
      </span>
      <!-- 后置元素 -->
      <div class="el-input-group__append" v-if="$slots.append">
        <slot name="append">元</slot>
      </div>
    </template>
    <textarea
      v-else
      class="el-textarea__inner"
      :value="formatValue"
      ref="textarea"
      v-bind="$props"
      :style="textareaStyle"
      @focus="handleFocus"
      @blur="handleBlur"
      @change="handleChange"
      :aria-label="label"
    >
    </textarea>
  </div>
</template>

<script>
import emitter from 'element-ui/src/mixins/emitter';
import Migrating from 'element-ui/src/mixins/migrating';
import calcTextareaHeight from 'element-ui/packages/input/src/calcTextareaHeight';
import merge from 'element-ui/src/utils/merge';
import accounting from './accounting'

export default {
  name: 'MoneyInput',

  componentName: 'MoneyInput',

  mixins: [emitter, Migrating],

  inject: {
    elForm: {
      default: ''
    },
    elFormItem: {
      default: ''
    }
  },

  data() {
    return {
      // currentValue: this.value,
      textareaCalcStyle: {},
      prefixOffset: null,
      suffixOffset: null,
      hovering: false,
      focused: false
    };
  },

  props: {
    oninput: String,
    value: {
      type: [String, Number],
      default: 0,
      desc: '数值'
    },
    placeholder: String,
    size: String,
    resize: String,
    name: String,
    form: String,
    id: String,
    maxlength: Number,
    minlength: Number,
    readonly: Boolean,
    autofocus: Boolean,
    disabled: Boolean,
    type: {
      type: String,
      default: 'text'
    },
    autosize: {
      type: [Boolean, Object],
      default: false
    },
    rows: {
      type: Number,
      default: 2
    },
    autoComplete: {
      type: String,
      default: 'off'
    },
    max: null,
    min: null,
    step: {},
    validateEvent: {
      type: Boolean,
      default: true
    },
    suffixIcon: String,
    prefixIcon: String,
    label: String,
    clearable: {
      type: Boolean,
      default: false
    },
    symbol: {
      type: String,
      default: '¥',
      desc: '货币标识符'
    },
    danweiName: { // 单位
      type: String,
      default: '',
      desc: '单位'
    },
    decimal: {
      type: Number,
      default: 4,
      desc: '小数位'
    }
  },

  computed: {
    _elFormItemSize() {
      return (this.elFormItem || {}).elFormItemSize;
    },
    validateState() {
      return this.elFormItem ? this.elFormItem.validateState : '';
    },
    needStatusIcon() {
      return this.elForm ? this.elForm.statusIcon : false;
    },
    validateIcon() {
      return {
        validating: 'el-icon-loading',
        success: 'el-icon-circle-check',
        error: 'el-icon-circle-close'
      }[this.validateState];
    },
    textareaStyle() {
      return merge({}, this.textareaCalcStyle, { resize: this.resize });
    },
    inputSize() {
      return this.size || this._elFormItemSize || (this.$ELEMENT || {}).size;
    },
    isGroup() {
      return this.$slots.prepend || this.$slots.append;
    },
    showClear() {
      return this.clearable && this.formatValue !== '' && (this.focused || this.hovering);
    },
    formatValue: {
      get() {
        if (this.focused) {
          return accounting.unformat(this.value);
        } else {
          if (this.danweiName) {
            return accounting.formatMoney(this.value, this.symbol, this.decimal) + ' ' + this.danweiName;
          }
          return accounting.formatMoney(this.value, this.symbol, this.decimal);
        }
      },
      set(newValue) {
        // setter
      }
    }
  },

  watch: {
    'value'(val, oldValue) {
      this.setCurrentValue(val);
    }
  },

  methods: {
    formatDanwei(value, danweiName) { // 格式化单位
      return value + danweiName
    },
    focus() {
      (this.$refs.input || this.$refs.textarea).focus();
    },
    getMigratingConfig() {
      return {
        props: {
          icon: 'icon is removed, use suffix-icon / prefix-icon instead.',
          'on-icon-click': 'on-icon-click is removed.'
        },
        events: {
          click: 'click is removed.'
        }
      };
    },
    handleBlur(event) {
      // 取消原input的事件,放入blur和change
      this.handleInput(event)
      this.focused = false;
      this.$emit('blur', event);
      if (this.validateEvent) {
        this.dispatch('ElFormItem', 'el.form.blur', [this.formatValue]);
      }
      this.$emit('inputblur')
    },
    inputSelect() {
      (this.$refs.input || this.$refs.textarea).select();
    },
    resizeTextarea() {
      if (this.$isServer) return;
      const { autosize, type } = this;
      if (type !== 'textarea') return;
      if (!autosize) {
        this.textareaCalcStyle = {
          minHeight: calcTextareaHeight(this.$refs.textarea).minHeight
        };
        return;
      }
      const minRows = autosize.minRows;
      const maxRows = autosize.maxRows;

      this.textareaCalcStyle = calcTextareaHeight(this.$refs.textarea, minRows, maxRows);
    },
    handleFocus(event) {
      this.focused = true;
      // this.$emit('focus', event);
      setTimeout(() => {
        event.target.select()
      }, 0)
      this.$emit('inputfocus')
    },
    // 取消原input的事件,放入blur和change
    handleInput(event) {
      let value = event ? event.target.value : 0;
      if (value < 0) {
        value = 0;
      }
      // 增加最大值最小值
      if (this.max && value > this.max) {
        value = this.max
      }
      if (this.min && (value < this.min) && (value >= 0)) {
        value = this.min
      }
      const formatvalue = parseFloat(parseFloat(accounting.unformat(value)).toFixed(this.decimal));
      this.$emit('input', formatvalue);
      // this.setCurrentValue(value);
    },
    handleChange(event) {
      // 取消原input的事件,放入blur和change
      this.handleInput(event)
      // 增加最大值最小值
      if (this.max && event.target.value > this.max) {
        event.target.value = this.max
      }
      if (this.min && (event.target.value < this.min) && (event.target.value >= 0)) {
        event.target.value = this.min
      }
      /* const value = accounting.formatMoney(event.target.value, this.symbol, this.decimal);
      this.$emit('change', value);
      this.setCurrentValue(value);*/
      this.$emit('change', event.target.value);
    },
    setCurrentValue(value) {
      if (value === this.formatValue) return;
      this.$nextTick(_ => {
        this.resizeTextarea();
      });
      this.formatValue = value;
      if (this.validateEvent) {
        this.dispatch('ElFormItem', 'el.form.change', [value]);
      }
    },
    calcIconOffset(place) {
      const pendantMap = {
        suf: 'append',
        pre: 'prepend'
      };

      const pendant = pendantMap[place];

      if (this.$slots[pendant]) {
        return { transform: `translateX(${place === 'suf' ? '-' : ''}${this.$el.querySelector(`.el-input-group__${pendant}`).offsetWidth}px)` };
      }
    },
    clear() {
      this.$emit('input', '');
      this.$emit('change', '');
      this.setCurrentValue('');
      this.focus();
    }
  },

  created() {
    if (this.value === 0) {
      this.handleInput(undefined) // 初始化默认赋值v-model 0
    }
    this.$on('inputSelect', this.inputSelect);
  },

  mounted() {
    this.resizeTextarea();
    if (this.isGroup) {
      this.prefixOffset = this.calcIconOffset('pre');
      this.suffixOffset = this.calcIconOffset('suf');
    }
  }
};
</script>
