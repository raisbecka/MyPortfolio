import { useCallback, useEffect, useRef, useState } from 'react'
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
  label: string
  value: string
  items: ExperienceItem[]
}

const experiences: ExperienceCategory[] = [
  {
    label: 'IBM Maximo',
    value: 'ibm-maximo',
    items: [
      {
        role: 'Acting Program Manager - Digital Environmental (in addition to below role)',
        company: 'The Regional Municipality of York',
        period: 'Sept 2025 - April 2026',
        current: true,
        icon: 'lucide:briefcase',
        key: 'Successfully lead small team of specialists though a major upgrade (7.6.x -> MAS 9.1), infrastructure change (WebSphere -> RedHat OpenShift), and cloud migration simultaneously - in a little over 6 months.',
      },
      {
        role: 'Maximo Systems Specialist',
        company: 'The Regional Municipality of York',
        period: '2019 - present',
        icon: 'lucide:settings',
        key: 'Developed multiple custom regulatory applications in both Maximo and EZMaxMobile - used daily • Automated staff scheduling, increasing efficiency by 80-90% • Optimized licensing for staff leading to > 1.2 million in savings • Successfully integrated ERP, GIS, SCADA, and multiple other proprietary, legacy systems',
      },
    ],
  },
  {
    label: 'Software Development',
    value: 'software-development',
    items: [
      {
        role: 'Business Systems Specialist',
        company: 'The Regional Municipality of York',
        period: '2019 - Present',
        current: true,
        icon: 'lucide:code',
        key: 'Developed multiple Java enterprise applications from scratch • Spearheaded implementation of modern CI/CD pipelines in Azure DevOps - reducing deployment time by 80% • Setup performance monitoring infrastructure using Prometheus and Grafana',
      },
      {
        role: 'Business Intelligence and Process Management Analyst',
        company: 'The Regional Municipality of York',
        period: '2017 - 2019',
        icon: 'lucide:layers',
        key: 'Built secure portal for Childcare Operators to submit and track funding applications online • ***SEE RESUMES***',
      },
      {
        role: 'Junior Developer',
        company: 'StartupHub',
        period: '2018 - 2020',
        icon: 'lucide:terminal',
        key: 'Developed features for SaaS platform using React and Python • Wrote comprehensive unit and integration tests • Participated in agile development processes and code reviews',
      },
    ],
  },
  {
    label: 'Business Intelligence & Data Analytics',
    value: 'business-intelligence',
    items: [
      {
        role: 'Senior BI Developer',
        company: 'Strategic Analytics Inc.',
        period: '2022 - Present',
        current: true,
        icon: 'lucide:pie-chart',
        key: 'Successfully bridged on-prem and cloud systems using Denodo data virtualization • Designed semantic models in Power BI and Tableau serving 500+ users • Reduced report development time by 70% through standardized frameworks',
      },
      {
        role: 'Senior BI Developer',
        company: 'DataVision Partners',
        period: '2020 - 2022',
        icon: 'lucide:line-chart',
        key: 'Developed executive dashboards tracking $50M+ in revenue metrics • Implemented self-service BI platform increasing adoption by 200% • Created automated data refresh processes ensuring 99.9% uptime',
      },
      {
        role: 'BI Analyst',
        company: 'Metrics Solutions',
        period: '2018 - 2020',
        icon: 'lucide:trending-up',
        key: 'Built operational reports and KPI tracking systems • Conducted training sessions for 100+ business users • Automated monthly reporting saving 40 hours per month',
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
    <div className="relative">
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
  const autoplayRef = useRef(
    Autoplay({ delay: 10000, stopOnInteraction: true, stopOnMouseEnter: true }),
  )
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    autoplayRef.current,
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
    return () => {
      emblaApi.off('select', onSelect)
    }
  }, [emblaApi, onSelect])

  return (
    <div>
      <div className="flex items-center gap-3">
        <button
          onClick={scrollToPrev}
          className="border-border bg-background text-foreground hover:bg-muted flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-md border transition-colors"
          aria-label="Previous"
        >
          <ChevronLeft className="size-5" />
        </button>

        <div className="flex-1 overflow-hidden" ref={emblaRef}>
          <div className="flex">
            {experiences.map((cat) => (
              <div key={cat.value} className="min-w-0 flex-[0_0_100%]">
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
