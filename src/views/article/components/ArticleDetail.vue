<template>
  <div class="createPost-container">
    <el-form
      ref="postForm"
      :model="postForm"
      :rules="rules"
      class="form-container"
    >
      <sticky :z-index="10" :class-name="'sub-navbar published'">
        <el-button
          v-loading="loading"
          style="margin-left: 5%"
          type="success"
          @click="submitForm"
        >
          保存
        </el-button>
        <!-- <el-button v-loading="loading" type="warning" @click="draftForm">
          Draft
        </el-button> -->
      </sticky>

      <div class="createPost-main-container">
        <el-row>
          <el-col :span="24">
            <el-form-item style="margin-bottom: 40px" prop="title">
              <MDinput
                v-model="postForm.title"
                :maxlength="100"
                name="title"
                required
              >
                文章标题
              </MDinput>
            </el-form-item>

            <div class="postInfo-container">
              <el-row>
                <el-col :span="5">
                  <el-form-item
                    label-width="60px"
                    label="分类:"
                    class="postInfo-container-item"
                  >
                    <el-select
                      v-model="postForm.category"
                      :remote-method="getCategories"
                      filterable
                      default-first-option
                      remote
                      placeholder="选择分类"
                    >
                      <el-option
                        v-for="(item, index) in cates"
                        :key="item + index"
                        :label="item.name"
                        :value="item.id"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item
                    label-width="60px"
                    label="来源:"
                    class="postInfo-container-item"
                  >
                    <MDinput
                      v-model="postForm.source"
                      :maxlength="30"
                      name="source"
                      required
                      style="top: -40px"
                    />
                  </el-form-item>
                </el-col>

                <el-col :span="8">
                  <el-form-item
                    label-width="120px"
                    label="发布时间:"
                    class="postInfo-container-item"
                  >
                    <el-date-picker
                      v-model="displayTime"
                      type="datetime"
                      format="yyyy-MM-dd HH:mm:ss"
                      placeholder="Select date and time"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item
                    label-width="60px"
                    label="状态:"
                    class="postInfo-container-item"
                  >
                    <el-switch
                      v-model="postForm.status"
                      class="mb-2"
                      active-text="正常"
                      inactive-text="屏蔽"
                    />
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
          </el-col>
        </el-row>

        <el-form-item
          style="margin-bottom: 40px"
          label-width="70px"
          label="标签:"
        >
          <el-input
            v-model="postForm.tags"
            :rows="2"
            type="textarea"
            class="article-textarea"
            autosize
            placeholder="标签以英文逗号(,)区隔"
          />
          <span v-show="contentShortLength" class="word-counter"
            >{{ contentShortLength }}个</span
          >
          <el-button
            v-loading="loading"
            style="margin-left: 90%"
            type="info"
            @click="getTags"
          >
            生成标签
          </el-button>
        </el-form-item>

        <el-form-item prop="content" label="内容" style="margin-bottom: 30px">
          <!-- <Tinymce ref="editor" v-model="postForm.content" :height="400" /> -->
          <el-input
            v-model="postForm.content"
            :rows="25"
            type="textarea"
            placeholder="Please input"
          />
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>

<script>
import Tinymce from "@/components/Tinymce";
// import Upload from '@/components/Upload/SingleImage3'
import MDinput from "@/components/MDinput";
import Sticky from "@/components/Sticky"; // 粘性header组件
import { fetchArticle, getTags, getCates, createArticle, updateArticle } from "@/api/article";
// import { searchUser } from '@/api/remote-search'
import Warning from "./Warning";
import {
  CommentDropdown,
  PlatformDropdown,
  SourceUrlDropdown,
} from "./Dropdown";
// import { ref } from "vue";
// const textarea = ref("");
const defaultForm = {
  category: undefined,
  status: true,
  title: "", // 文章题目
  content: "", // 文章内容
  tags: "", // 标签
  post_time: undefined, // 发布时间
  id: undefined,
  comment_disabled: false,
};

export default {
  name: "ArticleDetail",
  components: {
    Tinymce,
    MDinput,
    Sticky,
    Warning,
    CommentDropdown,
    PlatformDropdown,
    SourceUrlDropdown,
  },
  props: {
    isEdit: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    const validateRequire = (rule, value, callback) => {
      if (value === "") {
        this.$message({
          message: rule.field + "为必传项",
          type: "error",
        });
        callback(new Error(rule.field + "为必传项"));
      } else {
        callback();
      }
    };
    return {
      postForm: Object.assign({}, defaultForm),
      loading: false,
      userListOptions: [],
      rules: {
        title: [{ validator: validateRequire }],
        content: [{ validator: validateRequire }],
      },
      tempRoute: {},
      cates: [],
    };
  },
  computed: {
    contentShortLength() {
      if (!this.postForm.tags) return "0";

      return this.postForm.tags.split(",").length;
    },
    displayTime: {
      // set and get is useful when the data
      // returned by the back end api is different from the front end
      // back end return => "2013-06-25 06:59:25"
      // front end need timestamp => 1372114765000
      get() {
        // console.log((+new Date(this.postForm.post_time)))
        return +new Date(this.postForm.post_time);
      },
      set(val) {
        this.postForm.post_time = new Date(val);
      },
    },
  },
  created() {
    if (this.isEdit) {
      const id = this.$route.params && this.$route.params.id;
      this.fetchData(id);
    }
    this.getCategories();

    // Why need to make a copy of this.$route here?
    // Because if you enter this page and quickly switch tag, may be in the execution of the setTagsViewTitle function, this.$route is no longer pointing to the current page
    // https://github.com/PanJiaChen/vue-element-admin/issues/1221
    this.tempRoute = Object.assign({}, this.$route);
  },
  methods: {
    fetchData(id) {
      fetchArticle(id)
        .then((response) => {
          this.postForm = response.data;

          // just for test
          this.postForm.title += "";
          this.postForm.tags = this.postForm.tags.join(",");

          // set tagsview title
          this.setTagsViewTitle();

          // set page title
          this.setPageTitle();
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // getRemoteUserList(query) {
    //   searchUser(query).then(response => {
    //     if (!response.data.items) return
    //     this.userListOptions = response.data.items.map(v => v.name)
    //   })
    // }
    getCategories() {
      getCates()
        .then((response) => {
          this.cates = response.data.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    getTags() {
      getTags(this.postForm.content)
        .then((response) => {
          this.postForm.tags = response.data.tags.join(",");
        })
        .catch((err) => {
          console.log(err);
        });
    },
    setTagsViewTitle() {
      const title = "编辑文章";
      const route = Object.assign({}, this.tempRoute, {
        title: `${title}-${this.postForm.id}`,
      });
      // this.$store.dispatch("tagsView/updateVisitedView", route);
    },
    setPageTitle() {
      const title = "编辑文章";
      document.title = `${title} - ${this.postForm.title}`;
    },
    submitForm() {
      this.$refs.postForm.validate((valid) => {
        if (valid) {
          let data = {
            title: this.postForm.title,
            category: this.postForm.category,
            post_time: this.displayTime ? this.setTime(this.displayTime/1000) : this.setTime(Date.parse(new Date()) / 1000),
            source: this.postForm.source,
            status: this.postForm.status,
            content: this.postForm.content,
            tags: this.postForm.tags.split(','),
          };
          this.isEdit ? this.editArticle(data) : this.addArticle(data)
          this.$notify({
            title: "成功",
            message: this.isEdit? "修改成功" : "发布文章成功",
            type: "success",
            duration: 2000,
          });
          // this.postForm.status = 'published'
          this.loading = false;
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    setTime(fmt) {
      const time = new Date(fmt * 1000);
      const Y = time.getFullYear();
      const M = (time.getMonth() + 1).toString().padStart(2, "0");
      const D = time.getDate().toString().padStart(2, "0");
      const h = time.getHours().toString().padStart(2, "0");
      const m = time.getMinutes().toString().padStart(2, "0");
      // const s = time.getSeconds().toString().padStart(2, "0");
      return `${Y}-${M}-${D} ${h}:${m}`;
    },
    editArticle(data) {
      updateArticle(data, this.postForm.id)
    }, 
    addArticle(data) {
      createArticle(data).then(
        response => {
          const data = response.data
          this.$router.push({ path:'/article/edit/'+data.id})
        }
      )
    }
  },
};
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";

.createPost-container {
  position: relative;

  .createPost-main-container {
    padding: 40px 45px 20px 50px;

    .postInfo-container {
      position: relative;
      @include clearfix;
      margin-bottom: 10px;

      .postInfo-container-item {
        float: left;
      }
    }
  }

  .word-counter {
    width: 40px;
    position: absolute;
    right: 10px;
    top: 0px;
  }
}

.article-textarea ::v-deep {
  textarea {
    padding-right: 40px;
    resize: none;
    border: none;
    border-radius: 0px;
    border-bottom: 1px solid #bfcbd9;
  }
}
</style>
