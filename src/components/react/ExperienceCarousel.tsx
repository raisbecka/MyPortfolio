import { useCallback, useEffect, useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import {
  Briefcase,
  Settings,
  Code,
  Layers,
  Terminal,
  PieChart,
  LineChart,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  'lucide:briefcase': Briefcase,
  'lucide:settings': Settings,
  'lucide:code': Code,
  'lucide:layers': Layers,
  'lucide:terminal': Terminal,
  'lucide:pie-chart': PieChart,
  'lucide:line-chart': LineChart,
  'lucide:trending-up': TrendingUp,
}

type ExperienceItem = {
  role: string
  company: string
  period: string
  current?: boolean
  icon: string
  key: string
}

type ExperienceCategory = {
  id: string
  label: string
  value: string
  items: ExperienceItem[]
}

const experiences: ExperienceCategory[] = [
  {
    id: 'maximo-experience',
    label: 'IBM Maximo',
    value: 'ibm-maximo',
    items: [
      {
        role: 'Acting Program Manager, Digital Environmental (concurrent assignment)',
        company: 'York Region',
        period: 'Sep 2025–Apr 2026',
        current: true,
        icon: 'lucide:briefcase',
        key: [
          'Led a specialist team through a Maximo 7.6-to-MAS 9.1 upgrade, cloud migration and transition from WebSphere to Red Hat OpenShift in just over six months.',
          'Connected the cloud platform to on-premises systems through Denodo middleware.',
        ].join(' • '),
      },
      {
        role: 'Maximo Systems Specialist',
        company: 'York Region',
        period: '2019–present',
        icon: 'lucide:settings',
        key: [
          'Developed custom Maximo and mobile applications for facility logbooks, on-call scheduling and employee absence requests.',
          'Maintained York Region’s complex water and wastewater location and asset hierarchies, and configured preventive maintenance, job plans, inspections and other core asset management functions.',
          'Replaced an Oracle APEX scheduling system with Maximo and reduced the time spent building and maintaining staff schedules by 80–90%.',
          'Analyzed user activity and application access, optimized security groups and transitioned to IBM App Points, achieving projected licensing savings exceeding CAD $1.2 million over ten years.',
          'Integrated Maximo with HR, GIS, laboratory and reporting systems, including automated laboratory data validation and unit conversion.',
        ].join(' • '),
      },
    ],
  },
  {
    id: 'developer-experience',
    label: 'Enterprise Developer',
    value: 'Enterprise-Developer',
    items: [
      {
        role: 'Business Systems Specialist',
        company: 'York Region',
        period: '2019–present',
        current: true,
        icon: 'lucide:code',
        key: [
          'Built eLogbook, a Java Struts/Spring extension to EZMaxMobile, for water and wastewater staff working centrally and in the field; later rebuilt it using Maximo Mobile’s React-based framework.',
          'Introduced Azure DevOps CI/CD pipelines, eliminating manual deployment errors and reducing deployment time from several hours to 30–40 minutes.',
          'Combined Prometheus/Grafana monitoring with JUnit load tests simulating hundreds of authenticated users to identify and eliminate recurring application crashes and associated downtime.',
        ].join(' • '),
      },
      {
        role: 'Business Intelligence and Process Management Analyst',
        company: 'York Region',
        period: '2017–2019',
        icon: 'lucide:layers',
        key: [
          'Developed public-facing digital services for Public Health and Child Care Services using Microsoft SharePoint, Power Platform and IBM WebSphere.',
          'Managed requirements, development, stakeholder coordination, documentation, training and support, including documenting and redesigning business processes where appropriate.',
          'Onboarded the Housing department to Yardi Asset Management for desktop and mobile property management, preventive maintenance scheduling and inspection management.',
        ].join(' • '),
      },
      {
        role: 'Independent Consultant',
        company: 'Selected clients, including Game Used Only and High Speed Hockey',
        period: '2015–2025',
        icon: 'lucide:terminal',
        key: [
          'Built and maintained custom React web applications and Visual Basic desktop tools.',
          'Implemented Cloudflare security and authentication, and reduced time to first byte by more than 70%.',
        ].join(' • '),
      },
    ],
  },
]

function TimelineItem({
  exp,
  isLast,
}: {
  exp: ExperienceItem
  isLast: boolean
}) {
  const IconComp = iconMap[exp.icon]
  return (
    <div className="relative" data-experience-item>
      {!isLast && (
        <div
          className="bg-border absolute top-8 bottom-0 left-[11px] w-px"
          aria-hidden="true"
        />
      )}
      <div className="flex gap-4">
        <div
          className={`ring-background relative z-10 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full ring-4 ${
            exp.current
              ? 'bg-primary text-primary-foreground shadow-primary/20 shadow-lg'
              : 'bg-muted text-muted-foreground'
          }`}
        >
          {IconComp && <IconComp className="size-3.5" />}
        </div>
        <div className="min-w-0 flex-1 pb-2">
          <div className="mb-1">
            <h3 className="text-lg leading-tight font-semibold">{exp.role}</h3>
            <p className="text-muted-foreground text-sm">
              {exp.company} · {exp.period}
            </p>
          </div>
          <p className="text-muted-foreground/90 mt-2 text-sm leading-relaxed">
            {exp.key}
          </p>
        </div>
      </div>
    </div>
  )
}

export default function ExperienceCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 10000, stopOnInteraction: true, stopOnMouseEnter: true }),
  ])
  const [selectedIndex, setSelectedIndex] = useState(0)

  const scrollToPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi])
  const scrollToNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi])

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setSelectedIndex(emblaApi.selectedScrollSnap())
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    onSelect()
    emblaApi.on('select', onSelect)
    emblaApi.on('reInit', onSelect)
    const scrollToHash = () => {
      const index = experiences.findIndex((category) => `#${category.id}` === window.location.hash)
      if (index >= 0) emblaApi.scrollTo(index, true)
    }
    scrollToHash()
    window.addEventListener('hashchange', scrollToHash)
    return () => {
      window.removeEventListener('hashchange', scrollToHash)
      emblaApi.off('select', onSelect)
      emblaApi.off('reInit', onSelect)
    }
  }, [emblaApi, onSelect])

  return (
    <div data-experience-carousel>
      <div className="flex items-center gap-3">
        <button
          onClick={scrollToPrev}
          className="border-border bg-background text-foreground hover:bg-muted flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-md border transition-colors"
          aria-label="Previous"
        >
          <ChevronLeft className="size-5" />
        </button>

        <div className="flex-1 overflow-hidden" ref={emblaRef} data-experience-viewport>
          <div className="flex">
            {experiences.map((cat, categoryIndex) => (
              <div key={cat.value} id={cat.id} role="region" aria-label={cat.label} data-active={String(categoryIndex === selectedIndex)} className="min-w-0 flex-[0_0_100%]">
                <div className="px-1">
                  <h3 className="text-primary mb-4 text-xl font-semibold">
                    {cat.label}
                  </h3>
                  <div className="space-y-6">
                    {cat.items.map((exp, index) => (
                      <TimelineItem
                        key={`${cat.value}-${index}`}
                        exp={exp}
                        isLast={index === cat.items.length - 1}
                      />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={scrollToNext}
          className="border-border bg-background text-foreground hover:bg-muted flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-md border transition-colors"
          aria-label="Next"
        >
          <ChevronRight className="size-5" />
        </button>
      </div>

      <div className="mt-4 flex justify-center gap-2">
        {experiences.map((_, index) => (
          <button
            key={index}
            onClick={() => emblaApi?.scrollTo(index)}
            className={`h-2 rounded-full transition-all ${
              index === selectedIndex
                ? 'bg-primary w-6'
                : 'bg-border hover:bg-muted-foreground/50 w-2'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
