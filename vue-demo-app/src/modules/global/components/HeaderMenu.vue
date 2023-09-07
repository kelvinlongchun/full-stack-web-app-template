<script setup lang="ts">
import { RouterLink } from "vue-router";

import Backdrop from "@/modules/common/components/Backdrop.vue";
import TextWithIcon from "./TextWithIcon.vue";
import AccountIcon from "@/modules/icon/components/AccountIcon.vue";
import LogoutIcon from "@/modules/icon/components/LogoutIcon.vue";

import { getInjection } from "@/modules/common/utils/get-injection.util";

import { Provider } from "@/modules/common/types/provider.type";

const props = defineProps<{
  isShowed: boolean;
}>();

const emit = defineEmits(["close"]);

const user = getInjection(Provider.user);
const userDispatch = getInjection(Provider.userDispatch);

function closeMenu() {
  emit("close");
}

function logout() {
  userDispatch.logoutUser();
  closeMenu();
}
</script>

<template>
  <Backdrop v-bind:isShowed="props.isShowed" v-on:click.self="closeMenu" />
  <Teleport to="body">
    <Transition name="fly-left">
      <nav v-if="props.isShowed" class="header-menu">
        <div v-if="user.isLoggedIn" class="header-menu__profile">
          <p class="header-menu__profile__username">{{ user.username }}</p>
          <p>{{ user.email }}</p>
        </div>
        <ul class="header-menu__list">
          <RouterLink v-if="user.isLoggedIn" to="/user" v-on:click="closeMenu">
            <li class="header-menu__list__item">
              <TextWithIcon>
                <template v-slot:icon><AccountIcon /></template>
                <template v-slot:text>Account Info</template>
              </TextWithIcon>
            </li>
          </RouterLink>
          <li
            v-if="user.isLoggedIn"
            class="header-menu__list__item"
            v-on:click="logout"
          >
            <TextWithIcon>
              <template v-slot:icon><LogoutIcon /></template>
              <template v-slot:text>Logout</template>
            </TextWithIcon>
          </li>
        </ul>
      </nav>
    </Transition>
  </Teleport>
</template>

<style scoped lang="scss">
@import "@/sass/all";

.header-menu {
  position: absolute;
  top: 0;
  right: 0;
  width: 18rem;
  max-width: 80vw;
  height: 100vh;
  background-color: $nav-bar-color;

  .header-menu__profile {
    @include standard-padding;
    background-color: $background-color;

    .header-menu__profile__username {
      font-size: 1.2rem;
      color: $theme-color;
    }
  }

  .header-menu__list {
    list-style: none;

    .header-menu__list__item {
      @include standard-padding;
      padding-top: 1rem;
      padding-bottom: 1rem;

      &:hover {
        cursor: pointer;
        background-color: $nav-bar-support-dark-color;
        transition: all 0.3s ease;
      }
    }
  }
}
</style>
