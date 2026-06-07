import { useEffect } from 'react'
import { InfiniteScroll } from './InfiniteScroll'
import { getIcon } from './SkillsIconLoader'

// Types for technologies
type Category = {
  text: string
  logo: string
}

type Technologies = {
  'Systems & Virtualization': Category[]
  'Automation & Orchestration': Category[]
  'Cloud & Infrastructure': Category[]
  'Monitoring & Tools': Category[]
}

// Technologies based on CV
const technologies: Technologies = {
  'Systems & Virtualization': [
    { text: 'RedHat Enterprise Linux', logo: 'simple-icons:linux' },
    { text: 'Ubuntu', logo: 'mdi:ubuntu' },
    { text: 'Windows Server', logo: 'mdi:windows' },
    { text: 'Proxmox', logo: 'simple-icons:proxmox' },
    { text: 'Docker', logo: 'mdi:docker' },
    { text: 'VMWare Server', logo: 'mdi:vmware' },
  ],
  'Automation & Orchestration': [
    { text: 'Ansible', logo: 'simple-icons:ansible' },
    { text: 'Bash', logo: 'lucide:terminal' },
    { text: 'Azure DevOps', logo: 'lucide:microsoft-azure-devops' },
    { text: 'Git', logo: 'mdi:git' },
    { text: 'UIPath', logo: 'simple-icons:uipath' },
    { text: 'Power Automate', logo: 'lucide:workflow' },
    { text: 'JMeter', logo: 'simple-icons:apachejmeter' },
  ],
  'Cloud & Infrastructure': [
    { text: 'AWS', logo: 'lucide:cloud' },
    { text: 'Microsoft Azure', logo: 'mdi:microsoft-azure' },
    { text: 'Cloudflare', logo: 'simple-icons:cloudflare' },
    { text: 'SharePoint', logo: 'mdi:microsoft' },
    { text: 'IBM MAS/Maximo', logo: 'carbon:bee' },
  ],
  'Monitoring & Tools': [
    { text: 'Prometheus', logo: 'simple-icons:prometheus' },
    { text: 'Grafana', logo: 'simple-icons:grafana' },
    { text: 'OpenTelemetry', logo: 'simple-icons:opentelemetry' },
    { text: 'Apache', logo: 'simple-icons:apache' },
    { text: 'Nginx', logo: 'simple-icons:nginx' },
    { text: 'MySQL', logo: 'simple-icons:mysql' },
    { text: 'PostgreSQL', logo: 'simple-icons:postgresql' },
    { text: 'Oracle Database', logo: 'lucide:database-search' },
    { text: 'Llama.cpp', logo: 'simple-icons:ollama' },
    { text: 'WordPress', logo: 'simple-icons:wordpress' },
    { text: 'Jira', logo: 'simple-icons:jira' },
    { text: 'Confluence', logo: 'simple-icons:confluence' },
  ],
}

const categories = Object.keys(technologies)
const enlargedIcons = [
  'simple-icons:apachejmeter',
  'simple-icons:mysql',
  'simple-icons:apache',
  'mdi:vmware',
  'simple-icons:uipath',
]
const groupSize = Math.ceil(categories.length / 3)
const categoryGroups = [
  categories.slice(0, groupSize),
  categories.slice(groupSize, groupSize * 2),
  categories.slice(groupSize * 2),
]

const Skills: React.FC = () => {
  useEffect(() => {
    document.querySelectorAll('.tech-badge').forEach((badge) => {
      badge.classList.add('tech-badge-visible')
    })
  }, [])

  return (
    <div className="z-30 mx-auto mt-12 flex w-full max-w-[calc(100vw-5rem)] flex-col lg:max-w-full">
      <div className="space-y-2">
        {categoryGroups.map((group, groupIndex) => (
          <InfiniteScroll
            key={groupIndex}
            duration={50000}
            direction={groupIndex % 2 === 0 ? 'normal' : 'reverse'}
            showFade={true}
            className="flex flex-row justify-center"
          >
            {group.flatMap((category) =>
              technologies[category as keyof Technologies].map(
                (tech: Category, techIndex: number) => {
                  const IconComponent = getIcon(tech.logo)
                  return (
                    <div
                      key={`${category}-${techIndex}`}
                      className="tech-badge repo-card border-border bg-card text-muted-foreground mr-5 flex items-center gap-3 rounded-full border p-3 shadow-sm backdrop-blur-sm transition-all duration-300 hover:shadow-md"
                      data-tech-name={`${category}-${techIndex}`}
                    >
                      <span className="bg-muted flex h-10 w-10 items-center justify-center rounded-full p-2 shadow-inner">
                        <IconComponent
                          className={`tech-icon text-primary ${enlargedIcons.includes(tech.logo) ? 'text-2xl' : 'text-lg'}`}
                        />
                      </span>
                      <span className="text-foreground font-medium">
                        {tech.text}
                      </span>
                    </div>
                  )
                },
              ),
            )}
          </InfiniteScroll>
        ))}
      </div>
    </div>
  )
}

export default Skills
