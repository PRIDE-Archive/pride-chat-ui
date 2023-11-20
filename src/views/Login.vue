<template>
  <div class="submit-data-container">
    <div class="content-container">
      <div style="display: flex;justify-content: space-between; align-items: baseline;">
        <h2 class="project-title">Log In</h2><!-- <span>Already have an account? Please <a href="">Log in</a></span> -->
      </div>
      <span style="display: block; border-bottom: 1px solid rgba(100, 102, 100, 0.4);margin-bottom: 70px;"> </span>
      <Form class="form" ref="formInline" :model="formInline" :rules="ruleInline">
        <FormItem prop="user">
          <Input type="text" v-model="formInline.user" placeholder="UserName">
          <Icon type="ios-person-outline" slot="prepend" size="14"></Icon>
          </Input>
        </FormItem>
        <FormItem prop="password">
          <Input :type="passwordType" v-model="formInline.password" placeholder="Password">
          <Icon type="ios-lock-outline" slot="prepend" size="14"></Icon>
          </Input>
        </FormItem>
        <div class="login-action">
          <Checkbox @on-change="passwordTypeChange">Show Password</Checkbox>
        </div>
        <FormItem>
          <Button type="primary" @click="login('formInline')" long>Log in</Button>
        </FormItem>
      </Form>
    </div>
  </div>
</template>
<script>

export default {
  data() {
    return {
      passwordType: 'password',
      formInline: {
        user: '',
        password: ''
      },
      ruleInline: {
        user: [
          { required: true, message: 'Please input username', trigger: 'blur' }
        ],
        password: [
          { required: true, message: 'Please input password', trigger: 'blur' },
          // { type: 'string', min: 5, message: 'At least 5 words', trigger: 'blur' }
        ]
      },
    }
  },
  components: {
    // NavBar,
  },
  methods: {
    login(name) {
      this.$refs[name].validate((valid) => {
        if (!valid) {
          this.$Message.error({ content: 'Format Invalid' });
          return
        }
        if (this.formInline.user == 'admin' && this.formInline.password == '123456') {
          localStorage.setItem('userName',this.formInline.user);
          this.$Message.success({ content: 'Login Success', duration: 3 })
          this.$router.push({ name: 'home' });
          window.dispatchEvent(new Event('userName'));

        } else {
          this.$Message.error({ content: 'Invalid Username or Password'});
        }
        
      })
    },
    passwordTypeChange(type) {
      if (type)
        this.passwordType = "text";
      else
        this.passwordType = "password"
    },

  },
  mounted: function () {
     this.$refs['formInline'].resetFields();
  },
}
</script>
<style scoped>
.content-container {
  margin: 0 auto;
  padding: 150px 125px;
}

.project-title {
  color: rgb(100, 102, 100);
  margin: 20px 0 5px 0;
}

.login-action {
  display: flex;
  justify-content: space-between;
  margin-top: -10px;
  margin-bottom: 50px;
  color: #454548 !important;
}

.login-action label {
  color: #454548 !important;
}

.login-action a {
  border-bottom-style: none !important;
  color: #444;
}

.login-action a:hover {
  color: #5bc0be;
}

@media (min-width: 768px) {
  .content-container {
    width: 750px;
  }
}

@media (min-width: 992px) {
  .content-container {
    width: 870px;
  }
}</style>
<style></style>
