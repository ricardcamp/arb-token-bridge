import React from 'react'
import { Disclosure, Popover } from '@headlessui/react'
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/outline'

import { Transition } from './Transition'
import { ExternalLink } from './ExternalLink'

export type HeaderMenuItem = {
  title: string
  anchorProps?: React.AnchorHTMLAttributes<HTMLAnchorElement>
  items?: HeaderMenuItem[]
}

export type HeaderMenuProps = {
  items: HeaderMenuItem[]
}

export function HeaderMenuDesktop(
  props: HeaderMenuProps & { children: React.ReactNode }
) {
  return (
    <Popover as="div" className="relative inline-block text-left">
      <div>
        <Popover.Button className="arb-hover hidden items-center whitespace-nowrap rounded-md text-base text-white lg:inline-flex lg:p-1">
          {props.children}

          {props.items?.length && (
            <ChevronDownIcon className="ml-1 h-4 w-4 shrink-0 grow-0 text-white" />
          )}
        </Popover.Button>
      </div>

      <Transition>
        <Popover.Panel className="header-menu-panel absolute -left-4 z-50 mt-4 w-80 rounded-md bg-white shadow-lg">
          <div className="px-6 py-4">
            {props.items.map((item, index) => {
              if (typeof item.anchorProps !== 'undefined') {
                return (
                  <a
                    key={index}
                    {...item.anchorProps}
                    target="_blank"
                    rel="noreferrer"
                    className="-mx-6 block cursor-pointer px-6 py-1 font-medium hover:bg-blue-arbitrum hover:text-white"
                  >
                    {item.title}
                  </a>
                )
              }

              const subitems = item.items || []

              return (
                <div key={index}>
                  <div className="py-1">
                    <span className="font-medium">{item.title}</span>
                  </div>
                  <div>
                    {subitems.map((subitem, sIndex) => (
                      <a
                        key={`${index}.${sIndex}`}
                        href={subitem.anchorProps?.href}
                        target="_blank"
                        rel="noreferrer"
                        className="-mx-6 block py-1 pl-10 pr-6 font-light hover:bg-blue-arbitrum hover:text-white"
                      >
                        {subitem.title}
                      </a>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </Popover.Panel>
      </Transition>
    </Popover>
  )
}

export function HeaderMenuMobile(
  props: HeaderMenuProps & { children: React.ReactNode }
) {
  return (
    <Disclosure>
      {({ open }) => (
        <div className="w-full">
          <Disclosure.Button
            className={`arb-hover flex w-full items-center justify-start px-6 py-3 ${
              open && `bg-white`
            }`}
          >
            <span
              className={`flex flex-row flex-nowrap items-center space-x-4 text-2xl font-medium text-white ${
                open && `text-blue-arbitrum`
              }`}
            >
              {props.children}
            </span>

            {props.items?.length && (
              <>
                {!open ? (
                  <ChevronDownIcon
                    className={`ml-2 h-4 w-4 shrink-0 grow-0 text-white`}
                  />
                ) : (
                  <ChevronUpIcon
                    className={`ml-2 h-4 w-4 shrink-0 grow-0 text-dark`}
                  />
                )}
              </>
            )}
          </Disclosure.Button>
          <Disclosure.Panel>
            <ul className="space-y-4 pt-4 pb-4">
              {props.items.map((item, index) => (
                <li
                  key={index}
                  className="px-12 text-left text-lg font-light text-white"
                >
                  <ExternalLink
                    href={item.anchorProps?.href}
                    className="hover:underline focus:underline"
                  >
                    {item.title}
                  </ExternalLink>
                </li>
              ))}
            </ul>
          </Disclosure.Panel>
        </div>
      )}
    </Disclosure>
  )
}
