import React, { useRef, useEffect, useState, useLayoutEffect, useCallback, useMemo } from 'react'

const reactScope = {
  React,
  useState,
  useEffect,
  useLayoutEffect,
  useRef,
  useCallback,
  useMemo,
}

export const scope = {
  ...reactScope,
}
